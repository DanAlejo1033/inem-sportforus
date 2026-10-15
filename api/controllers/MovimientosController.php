<?php
// ══════════════════════════════════════════════════════
//  INEM SportForUs — Controlador de Movimientos y Préstamos
//  Archivo: api/controllers/MovimientosController.php
// ══════════════════════════════════════════════════════

class MovimientosController {
    /**
     * Lista los últimos 500 movimientos ordenados por fecha descendente.
     */
    public static function index(PDO $db): void {
        $rows = $db->query("SELECT * FROM movimientos ORDER BY fecha DESC LIMIT 500")->fetchAll();
        ok($rows);
    }

    /**
     * Registra un nuevo préstamo y actualiza el balón a estado 'Préstamo'.
     */
    public static function prestamo(PDO $db): void {
        $b = body();
        $codigo  = strtoupper(trim($b['codigo']  ?? ''));
        $persona = trim($b['persona'] ?? '');
        $doc     = trim($b['documento'] ?? '');
        $area    = trim($b['area']    ?? '');
        $docente = trim($b['docente'] ?? '');
        $obs     = trim($b['obs']     ?? '');
        $fecha   = !empty($b['fecha']) ? $b['fecha'] : date('Y-m-d H:i:s');

        if (!$codigo)  err('Selecciona un balón.');
        if (!$persona) err('El nombre del responsable es obligatorio.');

        $row = $db->prepare("SELECT estado FROM balones WHERE codigo = ?");
        $row->execute([$codigo]);
        $balon = $row->fetch();
        if (!$balon) err('Balón no encontrado.');
        if ($balon['estado'] !== 'Disponible') err('El balón no está disponible.');

        $db->prepare("UPDATE balones SET estado='Préstamo' WHERE codigo=?")->execute([$codigo]);

        $db->prepare("
            INSERT INTO movimientos (id, codigo, tipo, persona, documento, area, docente, obs, estado, fecha)
            SELECT UUID(), b.codigo, b.tipo, ?, ?, ?, ?, ?, 'Préstamo', ?
            FROM balones b WHERE b.codigo = ?
        ")->execute([$persona, $doc, $area, $docente, $obs, $fecha, $codigo]);

        ok(['codigo' => $codigo]);
    }

    /**
     * Registra la devolución de un préstamo activo y restaura el estado a 'Disponible'.
     */
    public static function devolucion(PDO $db): void {
        $b = body();
        $codigo = strtoupper(trim($b['codigo'] ?? ''));
        $obs    = trim($b['obs'] ?? '');

        if (!$codigo) err('El código es obligatorio.');

        $row = $db->prepare("SELECT id FROM movimientos WHERE codigo=? AND estado='Préstamo' ORDER BY fecha DESC LIMIT 1");
        $row->execute([$codigo]);
        if (!$row->fetch()) err('No hay préstamo activo para ese código.');

        $db->prepare("
            UPDATE movimientos SET estado='Devuelto', obs=?
            WHERE codigo=? AND estado='Préstamo'
            ORDER BY fecha DESC LIMIT 1
        ")->execute([$obs, $codigo]);

        $db->prepare("UPDATE balones SET estado='Disponible' WHERE codigo=?")->execute([$codigo]);

        ok(['codigo' => $codigo]);
    }

    /**
     * Marca un balón como dañado (si no está prestado) y registra el movimiento correspondiente.
     */
    public static function danado(PDO $db): void {
        $b = body();
        $codigo = strtoupper(trim($b['codigo'] ?? ''));
        $obs    = trim($b['obs'] ?? '');

        if (!$codigo) err('El código es obligatorio.');

        $row = $db->prepare("SELECT tipo, estado FROM balones WHERE codigo=?");
        $row->execute([$codigo]);
        $balon = $row->fetch();
        if (!$balon) err('Balón no encontrado.');
        if ($balon['estado'] === 'Préstamo') err('No se puede marcar como dañado un balón en préstamo.');

        $db->prepare("UPDATE balones SET estado='Dañado', obs=? WHERE codigo=?")->execute([$obs ?: null, $codigo]);

        $db->prepare("
            INSERT INTO movimientos (id, codigo, tipo, persona, documento, area, docente, obs, estado, fecha)
            VALUES (UUID(), ?, ?, '—', '—', '—', '—', ?, 'Dañado', NOW())
        ")->execute([$codigo, $balon['tipo'], $obs ?: 'Sin descripción']);

        ok(['codigo' => $codigo]);
    }

    /**
     * Elimina un registro de movimiento individual.
     */
    public static function delete(PDO $db): void {
        $id = trim($_GET['id'] ?? '');
        if (!$id) err('ID requerido.');
        $db->prepare("DELETE FROM movimientos WHERE id=?")->execute([$id]);
        ok();
    }
}
