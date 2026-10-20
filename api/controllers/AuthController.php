<?php
// ══════════════════════════════════════════════════════
//  INEM SportForUs — Controlador de Autenticación y Encargados
//  Archivo: api/controllers/AuthController.php
// ══════════════════════════════════════════════════════

class AuthController {
    /**
     * Inicia sesión verificando credenciales en la tabla 'encargados'.
     */
    public static function login(PDO $db): void {
        $b = body();
        $identificador = trim($b['identificador'] ?? $b['usuario'] ?? '');
        $contrasena    = trim($b['contrasena'] ?? '');

        if (!$identificador || !$contrasena) {
            err('Debes ingresar tu usuario/correo y contraseña.', 400);
        }

        $stmt = $db->prepare("
            SELECT id, usuario, correo, nombre, contrasena, cargo, grado, seccion, creado_en 
            FROM encargados 
            WHERE usuario = ? OR correo = ? 
            LIMIT 1
        ");
        $stmt->execute([$identificador, $identificador]);
        $user = $stmt->fetch();

        if (!$user) {
            err('Credenciales incorrectas. Usuario no encontrado.', 401);
        }

        // Verifica si coincide por password_verify (hash BCRYPT) o texto plano (para datos de prueba)
        $passwordOk = password_verify($contrasena, $user['contrasena']) || ($contrasena === $user['contrasena']);

        if (!$passwordOk) {
            err('Contraseña incorrecta.', 401);
        }

        // Si la contraseña estaba en texto plano, la actualizamos automáticamente a hash BCRYPT seguro
        if ($contrasena === $user['contrasena']) {
            $newHash = password_hash($contrasena, PASSWORD_BCRYPT);
            $upd = $db->prepare("UPDATE encargados SET contrasena = ? WHERE id = ?");
            $upd->execute([$newHash, $user['id']]);
        }

        unset($user['contrasena']);
        ok($user);
    }

    /**
     * Registra un nuevo encargado (Estudiante o Profesor).
     */
    public static function register(PDO $db): void {
        $b = body();
        $usuario    = trim($b['usuario'] ?? '');
        $correo     = strtolower(trim($b['correo'] ?? ''));
        $nombre     = trim($b['nombre'] ?? '');
        $contrasena = trim($b['contrasena'] ?? '');
        $cargo      = trim($b['cargo'] ?? 'Estudiante');
        $grado      = isset($b['grado']) && trim($b['grado']) !== '' ? trim($b['grado']) : null;
        $seccion    = isset($b['seccion']) && trim($b['seccion']) !== '' ? trim($b['seccion']) : null;

        if (!$usuario) err('El nombre de usuario es obligatorio.', 400);
        if (!$correo || !filter_var($correo, FILTER_VALIDATE_EMAIL)) err('Ingresa un correo institucional válido.', 400);
        if (!$nombre) err('El nombre completo es obligatorio.', 400);
        if (strlen($contrasena) < 4) err('La contraseña debe tener al menos 4 caracteres.', 400);

        if (!in_array($cargo, ['Estudiante', 'Profesor'])) {
            err('El cargo debe ser Estudiante o Profesor.', 400);
        }

        // Si es profesor, grado y sección deben ser nulos
        if ($cargo === 'Profesor') {
            $grado = null;
            $seccion = null;
        }

        // Si es estudiante, requerir grado y sección
        if ($cargo === 'Estudiante' && (!$grado || !$seccion)) {
            err('Para registrar un estudiante debes indicar el grado y la sección / grupo.', 400);
        }

        // Verifica si el usuario o correo ya existen
        $chk = $db->prepare("SELECT id FROM encargados WHERE usuario = ? OR correo = ?");
        $chk->execute([$usuario, $correo]);
        if ($chk->fetch()) {
            err('El usuario o correo electrónico ya está registrado.', 409);
        }

        $hash = password_hash($contrasena, PASSWORD_BCRYPT);

        $stmt = $db->prepare("
            INSERT INTO encargados (usuario, correo, nombre, contrasena, cargo, grado, seccion, creado_en)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$usuario, $correo, $nombre, $hash, $cargo, $grado, $seccion]);
        $newId = $db->lastInsertId();

        ok([
            'id'      => (int)$newId,
            'usuario' => $usuario,
            'correo'  => $correo,
            'nombre'  => $nombre,
            'cargo'   => $cargo,
            'grado'   => $grado,
            'seccion' => $seccion
        ]);
    }

    /**
     * Lista los encargados registrados (para selectores de docentes/estudiantes).
     */
    public static function index(PDO $db): void {
        $stmt = $db->query("SELECT id, usuario, correo, nombre, cargo, grado, seccion, creado_en FROM encargados ORDER BY nombre ASC");
        ok($stmt->fetchAll());
    }
}
