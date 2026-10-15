<?php
// ══════════════════════════════════════════════════════
//  INEM SportForUs — Controlador de Balones / Inventario
//  Archivo: api/controllers/BalonesController.php
// ══════════════════════════════════════════════════════

class BalonesController {
    /**
     * Lista completa de balones ordenados por fecha de creación desc.
     */
    public static function index(PDO $db): void {
        $rows = $db->query("SELECT * FROM balones ORDER BY creado_en DESC")->fetchAll();
        ok($rows);
    }

    /**
     * Balones disponibles para el selector de nuevo préstamo.
     */
    public static function disponibles(PDO $db): void {
        $rows = $db->query("SELECT codigo, tipo FROM balones WHERE estado='Disponible' ORDER BY codigo")->fetchAll();
        ok($rows);
    }

    /**
     * Balones elegibles para marcar como dañados (solo disponibles).
     */
    public static function noDanados(PDO $db): void {
        $rows = $db->query("SELECT codigo, tipo, estado FROM balones WHERE estado = 'Disponible' ORDER BY codigo")->fetchAll();
        ok($rows);
    }

    /**
     * Registra un nuevo balón e inserta su movimiento inicial.
     */
    public static function store(PDO $db): void {
        $b = body();
        $codigo = strtoupper(trim($b['codigo'] ?? ''));
        $tipo   = trim($b['tipo']   ?? '');
        $estado = $b['estado'] ?? 'Disponible';
        $obs    = trim($b['obs'] ?? '');

        if (!$codigo) err('El código es obligatorio.');
        if (!in_array($estado, ['Disponible', 'Dañado'])) err('Estado no válido.');

        $chk = $db->prepare("SELECT id FROM balones WHERE codigo = ?");
        $chk->execute([$codigo]);
        if ($chk->fetch()) err("El código $codigo ya existe.");

        $ins = $db->prepare("INSERT INTO balones (codigo, tipo, estado, obs) VALUES (?,?,?,?)");
        $ins->execute([$codigo, $tipo, $estado, $obs ?: null]);

        $db->prepare("
            INSERT INTO movimientos (id, codigo, tipo, persona, documento, area, docente, obs, estado, fecha)
            VALUES (UUID(), ?, ?, '—', '—', '—', '—', ?, ?, NOW())
        ")->execute([$codigo, $tipo, "Registro inicial" . ($obs ? ": $obs" : ''), $estado]);

        ok(['codigo' => $codigo]);
    }

    /**
     * Elimina un balón (únicamente si está en estado Dañado) y sus movimientos asociados.
     */
    public static function delete(PDO $db): void {
        $id = trim($_GET['id'] ?? '');
        if (!$id) err('ID de balón requerido.');

        $stmt = $db->prepare("SELECT codigo, estado FROM balones WHERE id = ?");
        $stmt->execute([$id]);
        $balon = $stmt->fetch();

        if (!$balon) err('El balón no existe.');
        if ($balon['estado'] !== 'Dañado') err('Solo puedes eliminar balones que tengan estado "Dañado".');

        $db->beginTransaction();

        $delMov = $db->prepare("DELETE FROM movimientos WHERE codigo = ?");
        $delMov->execute([$balon['codigo']]);

        $delBal = $db->prepare("DELETE FROM balones WHERE id = ?");
        $delBal->execute([$id]);

        $db->commit();
        ok();
    }
}
