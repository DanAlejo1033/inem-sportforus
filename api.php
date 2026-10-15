<?php
// ══════════════════════════════════════════════════════
//  INEM SportForUs — Enrutador Principal de la API REST
//  Archivo: api.php
// ══════════════════════════════════════════════════════

// ── Cabeceras y CORS ──────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Carga de Módulos y Controladores ──────────────────
require_once __DIR__ . '/api/config/database.php';
require_once __DIR__ . '/api/helpers/response.php';
require_once __DIR__ . '/api/controllers/KpiController.php';
require_once __DIR__ . '/api/controllers/BalonesController.php';
require_once __DIR__ . '/api/controllers/MovimientosController.php';
require_once __DIR__ . '/api/controllers/ExportController.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = trim($_GET['action'] ?? '');
$db = null;

try {
    $db = getDB();

    // ── Enrutamiento por Acción ───────────────────────────
    switch ($action) {
        // Métricas
        case 'kpis':
            if ($method === 'GET') KpiController::index($db);
            break;

        // Inventario de Balones
        case 'inventario':
            if ($method === 'GET') BalonesController::index($db);
            break;

        case 'disponibles':
            if ($method === 'GET') BalonesController::disponibles($db);
            break;

        case 'no_danados':
            if ($method === 'GET') BalonesController::noDanados($db);
            break;

        case 'nuevo_balon':
            if ($method === 'POST') BalonesController::store($db);
            break;

        case 'del_balon':
            if ($method === 'DELETE') BalonesController::delete($db);
            break;

        // Movimientos y Préstamos
        case 'movimientos':
            if ($method === 'GET') MovimientosController::index($db);
            break;

        case 'prestamo':
            if ($method === 'POST') MovimientosController::prestamo($db);
            break;

        case 'devolucion':
            if ($method === 'POST') MovimientosController::devolucion($db);
            break;

        case 'danado':
            if ($method === 'POST') MovimientosController::danado($db);
            break;

        case 'del_mov':
            if ($method === 'DELETE') MovimientosController::delete($db);
            break;

        // Exportaciones
        case 'export_sql':
            if ($method === 'GET') ExportController::exportSql($db);
            break;

        case 'export_csv':
            if ($method === 'GET') ExportController::exportCsv($db);
            break;

        default:
            err('Acción no reconocida.', 404);
    }

    err('Método HTTP no permitido para esta acción.', 405);

} catch (PDOException $e) {
    if ($db && $db->inTransaction()) {
        $db->rollBack();
    }
    err('Error de base de datos: ' . $e->getMessage(), 500);
} catch (Throwable $e) {
    if ($db && $db->inTransaction()) {
        $db->rollBack();
    }
    err('Error interno: ' . $e->getMessage(), 500);
}
