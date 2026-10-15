<?php
// ══════════════════════════════════════════════════════
//  INEM SportForUs — Controlador de Métricas (KPIs)
//  Archivo: api/controllers/KpiController.php
// ══════════════════════════════════════════════════════

class KpiController {
    /**
     * Retorna el conteo general de balones agrupado por estados.
     */
    public static function index(PDO $db): void {
        $row = $db->query("
            SELECT
              COUNT(*) AS total,
              SUM(estado = 'Disponible') AS disponibles,
              SUM(estado = 'Préstamo')   AS prestamo,
              SUM(estado = 'Dañado')     AS danados
            FROM balones
        ")->fetch();
        ok($row);
    }
}
