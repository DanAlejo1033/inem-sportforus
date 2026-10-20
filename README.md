# INEM SportForUs — Control de Material Deportivo

Sistema web integral para el inventario, control de préstamos, devoluciones y seguimiento del estado del material deportivo de la **Institución Educativa INEM José Félix de Restrepo** (Medellín, Colombia).

---

## 🚀 Cómo Iniciar el Sistema

### Opción 1: Lanzador Directo (Doble Clic)
Haz doble clic en el archivo **`iniciar_sistema.bat`**. 
Iniciará automáticamente el servidor PHP local y abrirá tu navegador en `http://localhost:8000`.

### Opción 2: Servidor XAMPP / Apache
1. Asegúrate de tener XAMPP con **Apache** y **MySQL** activos.
2. Si el proyecto se encuentra en `htdocs/balones` o con un alias, accede a:
   `http://localhost/balones`

### Opción 3: Terminal de Comandos
Ejecuta en la raíz del proyecto:
```bash
php -S localhost:8000
```
Y abre en tu navegador: `http://localhost:8000`

---

## 🗄️ Base de Datos MySQL

1. Abre **phpMyAdmin** o tu gestor de base de datos MySQL preferido en el puerto `3306`.
2. Importa y ejecuta el archivo [`schema.sql`](schema.sql).
3. Este script creará:
   * La base de datos `inem_balones`.
   * La tabla `balones` (inventario).
   * La tabla `movimientos` (historial de préstamos, devoluciones y daños).
   * Datos de demostración iniciales para pruebas.

> **Configuración de conexión:** Puedes personalizar las credenciales (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_PORT`) en [`api/config/database.php`](api/config/database.php).

---

## 🏛️ Arquitectura del Proyecto

El proyecto sigue una arquitectura modular limpia con separación estricta de responsabilidades:

```text
balones/
├── index.html                   // Marcado HTML semántico (sin scripts ni estilos embebidos)
├── iniciar_sistema.bat          // Lanzador rápido para Windows
├── logo.png                     // Escudo institucional INEM
├── schema.sql                   // Script DDL y datos de demostración
├── README.md                    // Documentación del sistema
├── .gitignore                   // Exclusión de temporales y volcados de backup
├── css/
│   └── style.css                // Estilos Glassmorphism, Cyberpunk, tablas, badges y modales
├── src/
│   ├── main.js                  // Orquestador principal de la aplicación frontend
│   ├── config/
│   │   └── constants.js         // Constantes globales de configuración, rutas y selectores
│   ├── services/
│   │   └── apiService.js        // Capa de comunicación HTTP con la API REST (fetch)
│   ├── ui/
│   │   ├── toast.js             // Notificaciones flotantes CyberToast y helpers de modales
│   │   └── uiHelpers.js         // Generador de badges de estado y motor de búsqueda
│   └── modules/
│       ├── auth.js              // Control de sesión y permisos delimitados por cargo (Profesor / Estudiante)
│       ├── kpis.js              // Consulta y renderizado dinámico de tarjetas de métricas
│       ├── inventario.js        // Catálogo de balones, paginación, correlativo INEM-XXX y bajas
│       └── movimientos.js       // Historial de préstamos, devoluciones rápidas y filtros
├── api.php                      // Router central delgado de la API REST
└── api/
    ├── config/
    │   └── database.php         // Conexión PDO singleton a MySQL
    ├── helpers/
    │   └── response.php         // Helpers JSON de respuesta HTTP ok(), err(), body() y CORS
    └── controllers/
        ├── AuthController.php        // Autenticación, registro y gestión de encargados
        ├── KpiController.php         // Métricas del dashboard
        ├── BalonesController.php     // CRUD y consultas de balones
        ├── MovimientosController.php // Gestión de préstamos, devoluciones y daños
        └── ExportController.php      // Exportación de respaldos SQL y reportes CSV (Excel)
```

---

## 🔐 Control de Acceso y Delimitación de Cargos (RBAC)

El sistema cuenta con una pantalla inicial de acceso (Login y Registro) con permisos delimitados según el cargo:

| Funcionalidad / Permiso | Profesor / Docente | Estudiante / Monitor |
| :--- | :---: | :---: |
| **Iniciar Sesión y Registrarse** | ✅ Sí | ✅ Sí |
| **Carga Inicial del Inventario** | Vista Completa (Todos) | 🎯 Enfocada en **Disponibles** |
| **Registrar Préstamos** | ✅ Sí | ✅ Sí |
| **Registrar Devolución de Balones** | ✅ Sí | ❌ No (Exclusivo Profesor por Seguridad) |
| **Visualizar / Gestionar Balones Dañados** | ✅ Sí | ❌ No (Ocultos para evitar ruido operativo) |
| **Registrar Nuevos Balones en Inventario** | ✅ Sí | ❌ No (Exclusivo Docente) |
| **Eliminar Balones Dañados (Baja definitiva)** | ✅ Sí | ❌ No (Exclusivo Docente) |
| **Eliminar Registros del Historial** | ✅ Sí | ❌ No (Exclusivo Docente) |
| **Exportar Respaldo de Base de Datos (SQL)** | ✅ Sí | ❌ No (Exclusivo Docente) |
| **Exportar Reportes a Excel (CSV)** | ✅ Sí | ✅ Sí |

---

## 📊 Endpoints de la API REST (`api.php`)

| Acción (`?action=`) | Método | Controlador | Descripción |
| :--- | :---: | :--- | :--- |
| `login` | `POST` | `AuthController::login` | Autentica usuario/correo y contraseña (BCRYPT / seguro). |
| `register` | `POST` | `AuthController::register` | Registra un nuevo encargado (`Estudiante` o `Profesor`). |
| `encargados` | `GET` | `AuthController::index` | Lista los encargados y docentes registrados. |
| `kpis` | `GET` | `KpiController::index` | Obtiene contadores totales, disponibles, en préstamo y dañados. |
| `inventario` | `GET` | `BalonesController::index` | Lista todos los balones registrados. |
| `disponibles` | `GET` | `BalonesController::disponibles` | Lista balones aptos para nuevo préstamo. |
| `no_danados` | `GET` | `BalonesController::noDanados` | Lista balones elegibles para marcar como dañados. |
| `nuevo_balon` | `POST` | `BalonesController::store` | Registra un nuevo balón con código automático. |
| `del_balon` | `DELETE` | `BalonesController::delete` | Elimina un balón (solo estado "Dañado") y sus movimientos. |
| `movimientos` | `GET` | `MovimientosController::index` | Historial de los últimos 500 movimientos. |
| `prestamo` | `POST` | `MovimientosController::prestamo` | Registra un nuevo préstamo y actualiza estado del balón. |
| `devolucion` | `POST` | `MovimientosController::devolucion` | Registra devolución y libera el balón a disponible. |
| `danado` | `POST` | `MovimientosController::danado` | Marca balón como dañado y registra incidencia. |
| `del_mov` | `DELETE` | `MovimientosController::delete` | Elimina un registro puntual del historial. |
| `export_csv` | `GET` | `ExportController::exportCsv` | Descarga reporte CSV (movimientos o inventario) compatible con Excel UTF-8. |
| `export_sql` | `GET` | `ExportController::exportSql` | Descarga respaldo completo SQL con estructura y datos. |

---

## 📋 Características Principales

* **Filtros en tiempo real:** Búsqueda combinada por texto (código o responsable), deporte (`Fútbol`, `Baloncesto`, `Voleibol`, `Fútbol Sala`, `Microfútbol`) y estado (`Disponible`, `Préstamo`, `Dañado`, `Devuelto`).
* **Paginación inteligente:** 10 registros por página en la vista de inventario con control de navegación.
* **Trazabilidad completa:** Cada préstamo registra quién tiene el balón, documento de identidad, área/grupo, docente a cargo y fecha/hora exacta.
* **Reportes descargables:** Exportación directa en CSV con delimitador de punto y coma y BOM UTF-8 para visualización inmediata en Microsoft Excel en español.
