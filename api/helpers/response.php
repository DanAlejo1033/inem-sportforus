<?php
// ══════════════════════════════════════════════════════
//  INEM SportForUs — Respuestas JSON y Helpers HTTP
//  Archivo: api/helpers/response.php
// ══════════════════════════════════════════════════════

/**
 * Envía una respuesta exitosa en formato JSON y finaliza la ejecución.
 */
function ok(mixed $data = null): void {
    echo json_encode(['ok' => true, 'data' => $data]);
    exit;
}

/**
 * Envía una respuesta de error con código HTTP específico y finaliza.
 */
function err(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

/**
 * Obtiene el cuerpo de la petición HTTP parseado desde JSON.
 */
function body(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw ?: '{}', true) ?? [];
}
