<?php
// ══════════════════════════════════════════════════════
//  INEM SportForUs — Controlador de Exportación y Backups
//  Archivo: api/controllers/ExportController.php
// ══════════════════════════════════════════════════════

class ExportController {
    /**
     * Exporta los datos a formato CSV compatible con Microsoft Excel (UTF-8 con BOM).
     * Por defecto exporta el historial de movimientos y préstamos.
     * Si se pasa ?tabla=inventario, exporta el inventario de balones.
     */
    public static function exportCsv(PDO $db): void {
        $tabla = strtolower(trim($_GET['tabla'] ?? 'movimientos'));
        $timestamp = date('Y-m-d_H-i');

        if ($tabla === 'inventario' || $tabla === 'balones') {
            $filename = "inem_inventario_balones_{$timestamp}.csv";
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="' . $filename . '"');

            // BOM para compatibilidad con Microsoft Excel
            echo "\xEF\xBB\xBF";
            $output = fopen('php://output', 'w');

            fputcsv($output, ['ID', 'Código', 'Tipo de Balón', 'Estado', 'Observaciones', 'Fecha de Registro'], ';');

            $stmt = $db->query("SELECT id, codigo, tipo, estado, obs, creado_en FROM balones ORDER BY creado_en DESC");
            while ($row = $stmt->fetch()) {
                fputcsv($output, [
                    $row['id'],
                    $row['codigo'],
                    $row['tipo'],
                    $row['estado'],
                    $row['obs'] ?: 'Sin observaciones',
                    $row['creado_en']
                ], ';');
            }
            fclose($output);
            exit;
        }

        // Exportación por defecto: Historial de movimientos y préstamos
        $filename = "inem_movimientos_prestamos_{$timestamp}.csv";
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');

        echo "\xEF\xBB\xBF";
        $output = fopen('php://output', 'w');

        fputcsv($output, [
            'ID Movimiento',
            'Código Balón',
            'Deporte / Tipo',
            'Persona / Responsable',
            'Documento / ID',
            'Área / Grupo',
            'Docente Responsable',
            'Observaciones',
            'Estado',
            'Fecha y Hora'
        ], ';');

        $stmt = $db->query("SELECT id, codigo, tipo, persona, documento, area, docente, obs, estado, fecha FROM movimientos ORDER BY fecha DESC");
        while ($row = $stmt->fetch()) {
            fputcsv($output, [
                $row['id'],
                $row['codigo'],
                $row['tipo'],
                $row['persona'],
                $row['documento'],
                $row['area'],
                $row['docente'],
                $row['obs'] ?: '—',
                $row['estado'],
                $row['fecha']
            ], ';');
        }
        fclose($output);
        exit;
    }

    /**
     * Exporta un volcado SQL descargable con la estructura y datos de ambas tablas.
     */
    public static function exportSql(PDO $db): void {
        header('Content-Type: text/plain; charset=utf-8');
        header('Content-Disposition: attachment; filename="inem_backup_' . date('Y-m-d_H-i') . '.sql"');

        // 1. Estructura y datos de 'balones'
        echo "-- Backup de la tabla balones\n";
        echo "DROP TABLE IF EXISTS `balones`;\n";
        echo "CREATE TABLE `balones` (\n";
        echo "  `id` INT AUTO_INCREMENT PRIMARY KEY,\n";
        echo "  `codigo` VARCHAR(50) NOT NULL,\n";
        echo "  `tipo` VARCHAR(50) NOT NULL,\n";
        echo "  `estado` VARCHAR(50) NOT NULL,\n";
        echo "  `obs` TEXT,\n";
        echo "  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n";
        echo ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n";

        $stmtBal = $db->query("SELECT * FROM balones");
        while ($b = $stmtBal->fetch()) {
            $codigo = $db->quote($b['codigo']);
            $tipo   = $db->quote($b['tipo']);
            $estado = $db->quote($b['estado']);
            $obs    = $db->quote($b['obs']);
            $creado = $db->quote($b['creado_en']);
            echo "INSERT INTO `balones` (`id`, `codigo`, `tipo`, `estado`, `obs`, `creado_en`) VALUES ({$b['id']}, {$codigo}, {$tipo}, {$estado}, {$obs}, {$creado});\n";
        }

        // 2. Estructura y datos de 'movimientos'
        echo "\n-- Backup de la tabla movimientos\n";
        echo "DROP TABLE IF EXISTS `movimientos`;\n";
        echo "CREATE TABLE `movimientos` (\n";
        echo "  `id` VARCHAR(50) PRIMARY KEY,\n";
        echo "  `codigo` VARCHAR(50) NOT NULL,\n";
        echo "  `tipo` VARCHAR(50) DEFAULT NULL,\n";
        echo "  `persona` VARCHAR(100) DEFAULT NULL,\n";
        echo "  `documento` VARCHAR(50) DEFAULT NULL,\n";
        echo "  `area` VARCHAR(50) DEFAULT NULL,\n";
        echo "  `docente` VARCHAR(100) DEFAULT NULL,\n";
        echo "  `obs` TEXT,\n";
        echo "  `estado` VARCHAR(50) NOT NULL,\n";
        echo "  `fecha` DATETIME DEFAULT CURRENT_TIMESTAMP\n";
        echo ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n";

        $stmtMov = $db->query("SELECT * FROM movimientos");
        while ($m = $stmtMov->fetch()) {
            $id        = $db->quote($m['id']);
            $codigo    = $db->quote($m['codigo']);
            $tipo      = $db->quote($m['tipo']);
            $persona   = $db->quote($m['persona']);
            $documento = $db->quote($m['documento']);
            $area      = $db->quote($m['area']);
            $docente   = $db->quote($m['docente']);
            $obs       = $db->quote($m['obs']);
            $estado    = $db->quote($m['estado']);
            $fecha     = $db->quote($m['fecha']);
            echo "INSERT INTO `movimientos` (`id`, `codigo`, `tipo`, `persona`, `documento`, `area`, `docente`, `obs`, `estado`, `fecha`) VALUES ({$id}, {$codigo}, {$tipo}, {$persona}, {$documento}, {$area}, {$docente}, {$obs}, {$estado}, {$fecha});\n";
        }
        exit;
    }
}
