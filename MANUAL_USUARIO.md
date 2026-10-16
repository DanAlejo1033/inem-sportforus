# 📖 Manual de Usuario — INEM SportForUs
### Sistema de Control y Trazabilidad de Material Deportivo
**Institución Educativa INEM José Félix de Restrepo**  
*Medellín, Colombia · Versión 1.0.0*

---

## 📌 Tabla de Contenido
1. [Introducción y Objetivos](#1-introducción-y-objetivos)
2. [Requisitos y Cómo Iniciar el Sistema](#2-requisitos-y-cómo-iniciar-el-sistema)
3. [Recorrido Visual por la Interfaz](#3-recorrido-visual-por-la-interfaz)
4. [Guías Paso a Paso (Casos de Uso)](#4-guías-paso-a-paso-casos-de-uso)
   - [4.1. Registrar un nuevo balón](#41-registrar-un-nuevo-balón)
   - [4.2. Registrar un préstamo de material](#42-registrar-un-préstamo-de-material)
   - [4.3. Registrar la devolución de un balón](#43-registrar-la-devolución-de-un-balón)
   - [4.4. Reportar un balón dañado o pinchado](#44-reportar-un-balón-dañado-o-pinchado)
   - [4.5. Dar de baja o eliminar un balón](#45-dar-de-baja-o-eliminar-un-balón)
   - [4.6. Búsqueda, filtros y paginación](#46-búsqueda-filtros-y-paginación)
   - [4.7. Exportar reportes a Excel (CSV) y respaldos SQL](#47-exportar-reportes-a-excel-csv-y-respaldos-sql)
5. [Preguntas Frecuentes y Solución de Problemas (FAQ)](#5-preguntas-frecuentes-y-solución-de-problemas-faq)
6. [Glosario de Términos](#6-glosario-de-términos)

---

## 1. Introducción y Objetivos

**INEM SportForUs** es una plataforma web desarrollada para la gestión centralizada de los implementos deportivos de la institución. Su propósito es garantizar la máxima disponibilidad del material, evitar pérdidas o extravíos y registrar con exactitud la trazabilidad de cada préstamo realizado durante las clases de educación física, torneos y entrenamientos deportivos.

### ¿A quién está dirigido este manual?
* **Docentes del área de Educación Física y Deportes.**
* **Monitores y auxiliares de material deportivo.**
* **Personal administrativo y de coordinación.**

---

## 2. Requisitos y Cómo Iniciar el Sistema

Para utilizar el sistema en tu equipo necesitas tener instalada la plataforma local **XAMPP**.

### Paso 1: Encender la Base de Datos en XAMPP
1. Abre el panel de control de **XAMPP**.
2. Ubica la fila de **MySQL** y haz clic en el botón **`Start`**.
3. Confirma que el indicador de MySQL se ilumine en **verde** y muestre el puerto `3306`.
> ⚠️ **Importante:** Si MySQL está apagado, el sistema no podrá cargar los balones ni guardar préstamos.

### Paso 2: Abrir la Aplicación
Tienes dos formas de acceder:
* **Opción A (Recomendada):** Ve a la carpeta del proyecto y haz doble clic sobre el archivo **`iniciar_sistema.bat`**. Se abrirá una ventana de consola que encenderá el servidor automáticamente y abrirá tu navegador web en `http://localhost:8000`.
* **Opción B (Navegador directo):** Abre Google Chrome, Microsoft Edge o Mozilla Firefox e ingresa la dirección:  
  `http://localhost:8000` *(o `http://localhost/balones` si utilizas Apache)*.

---

## 3. Recorrido Visual por la Interfaz

La pantalla principal se divide en cuatro áreas funcionales:

```
┌────────────────────────────────────────────────────────────────────────┐
│  [LOGO] SPORTFORUS · INEM                 [ CSV ] [ Menú Lateral ☰ ]   │
├────────────────────────────────────────────────────────────────────────┤
│  RESUMEN DEL INVENTARIO (KPIs):                                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ Total Balones│ │ Disponibles  │ │ En Préstamo  │ │ Dañados      │   │
│  │      20      │ │      12      │ │      4       │ │     4        │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
├────────────────────────────────────────────────────────────────────────┤
│  [ Movimientos ] [ Inventario ]    [+ Balón] [Prestar] [Devolver] [Dañ]│
│  Filtros: [ Buscar... ] [ Deporte ▾ ] [ Estado ▾ ]                     │
├────────────────────────────────────────────────────────────────────────┤
│  TABLA PRINCIPAL (Listado interactivo con acciones rápidas)            │
│  ...                                                                   │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Barra Superior (Top Bar):** Muestra el escudo oficial del INEM, el botón de descarga rápida de reportes en Excel (`CSV`) y el acceso al menú lateral desplegable.
2. **Tarjetas de Indicadores (KPIs):** Cuatro paneles interactivos que resumen el inventario en tiempo real. **Consejo:** Si haces clic en cualquiera de estas tarjetas, el sistema filtrará automáticamente la tabla de inventario por ese estado.
3. **Pestañas de Navegación:**
   * **Movimientos:** Historial cronológico de entregas, devoluciones y registros.
   * **Inventario:** Catálogo completo de balones con su estado físico y paginación.
4. **Botonera de Acciones:** Accesos directos para registrar balones, realizar préstamos, tramitar devoluciones o reportar averías.

---

## 4. Guías Paso a Paso (Casos de Uso)

---

### 4.1. Registrar un nuevo balón
**Objetivo:** Ingresar al inventario institucional un balón adquirido o donado.

1. Haz clic en el botón verde **`+ Nuevo Balón`** (ubicado en la barra de acciones o en el menú lateral).
2. Se desplegará la ventana modal de registro:
   * **Tipo de balón:** Selecciona el deporte correspondiente (`Fútbol`, `Baloncesto`, `Voleibol`, `Fútbol Sala` o `Microfútbol`).
   * **Código / Placa:** El sistema genera de forma automática el siguiente código correlativo disponible (ejemplo: `INEM-021`). *Este campo es de solo lectura para evitar códigos duplicados.*
   * **Estado inicial:** Por defecto viene en `Disponible`. Si el balón ingresa con algún detalle especial, puedes marcarlo como `Dañado`.
   * **Observaciones:** Especifica marca, serie, peso o características físicas (ejemplo: *Golty Invictus #5, obsequio torneo intercolegiado*).
3. Presiona el botón **`Guardar`**.
4. Aparecerá una notificación verde en la esquina inferior confirmando el registro exitoso y los contadores se actualizarán de inmediato.

---

### 4.2. Registrar un préstamo de material
**Objetivo:** Entregar balones a docentes, estudiantes o monitores para una sesión de clase o práctica deportiva.

1. Haz clic en el botón azul **`Prestar`**.
2. Diligencia el formulario con la información del responsable:
   * **Balón disponible:** Despliega el menú. *El sistema únicamente te mostrará aquellos balones que estén libres para préstamo.*
   * **Prestado a:** Nombre y apellidos de la persona que recibe el implemento.
   * **Documento / ID:** Documento de identidad (TI, CC o carné estudiantil).
   * **Área / Grupo:** Grado escolar o dependencia (ejemplo: *10-3*, *Selección Voleibol*, *Primaria*).
   * **Docente responsable:** Nombre del profesor titular a cargo de la clase o actividad.
   * **Fecha / Hora salida:** Fecha y hora en la que sale el balón (puedes ajustarla o dejar la hora actual).
3. Haz clic en **`Registrar`**.
4. El balón pasará inmediatamente al estado <span style="color:#d4991e; font-weight:bold;">Préstamo</span>, se restará de los disponibles y quedará registrado al inicio del historial de movimientos.

---

### 4.3. Registrar la devolución de un balón
**Objetivo:** Recibir un balón de vuelta, verificar su condición física e integrarlo nuevamente al inventario activo.

#### Método A: Devolución Rápida (Desde la tabla de Movimientos)
1. En la pestaña **Movimientos**, ubica el registro del préstamo activo.
2. En la columna *Acciones*, haz clic en el botón amarillo con icono de retorno (`↺`).
3. Se abrirá la ventana con el código del balón ya precargado.
4. Escribe cualquier observación sobre cómo se recibió (ejemplo: *Entregado a tiempo y con buena presión*).
5. Haz clic en **`Confirmar`**.

#### Método B: Devolución General
1. Haz clic en el botón amarillo **`Devolver`** de la barra de acciones.
2. Ingresa manualmente el código del balón (ejemplo: `INEM-003`).
3. Agrega la observación correspondiente y presiona **`Confirmar`**.

> 💡 **Resultado:** El estado del movimiento cambiará a **Devuelto** y el balón volverá a estar **Disponible** para ser prestado otra vez.

---

### 4.4. Reportar un balón dañado o pinchado
**Objetivo:** Registrar una avería física (válvula rota, pinchazo, costura descosida o deformación) para apartarlo de la rotación deportiva.

1. Haz clic en el botón rojo **`Dañado`**.
2. En el campo **Seleccionar balón**, escoge el implemento averiado.
   > ⛔ **Regla de negocio:** Un balón que se encuentre actualmente en **Préstamo** no puede ser marcado como dañado directamente; primero debe registrarse su devolución para certificar quién lo entregó en mal estado.
3. En **Descripción del daño**, detalla la falla (ejemplo: *Válvula averiada, fuga de aire continua*).
4. Haz clic en **`Confirmar`**.
5. El balón cambiará a estado <span style="color:#bf3f50; font-weight:bold;">Dañado</span> y se sumará al contador de atención prioritaria.

---

### 4.5. Dar de baja o eliminar un balón
**Objetivo:** Retirar permanentemente del inventario un balón irreparable o que ha cumplido su ciclo de vida útil.

1. Dirígete a la pestaña **Inventario**.
2. Filtra por el estado **Dañados** (o haz clic en la tarjeta roja de KPIs).
3. En la columna *Acciones*, verás el botón rojo de papelera (`🗑️`) **únicamente en los balones que tienen estado Dañado**.
4. Haz clic en el icono de papelera.
5. El sistema solicitará confirmación:  
   *`¿Eliminar el balón INEM-XXX del inventario? Esta acción no se puede deshacer.`*
6. Al aceptar, el registro se eliminará de forma definitiva y segura en la base de datos junto con su historial asociado.

---

### 4.6. Búsqueda, filtros y paginación
Para localizar rápidamente cualquier implemento deportivo entre cientos de registros:

* **Buscador predictivo en tiempo real:**
  * Puedes escribir el código completo (`INEM-015`) o solo los dígitos (`15`).
  * Puedes buscar por nombre del responsable (ejemplo: *Carlos*), grupo (*11-1*) o marca (*Mikasa*).
* **Filtros por Deporte:** Despliega y filtra exclusivamente balones de `Fútbol`, `Baloncesto`, `Voleibol`, `Fútbol Sala` o `Microfútbol`.
* **Filtros por Estado:** Visualiza solo balones `Disponibles`, `En Préstamo`, `Dañados` o movimientos `Devueltos`.
* **Paginación del Inventario:** Para una navegación fluida, el inventario muestra **10 balones por página**. En la parte inferior puedes navegar entre páginas numéricas o usar las flechas anterior/siguiente (`<` y `>`).

---

### 4.7. Exportar reportes a Excel (CSV) y respaldos SQL
El sistema permite descargar información para rendición de cuentas, auditorías de inventario o copias de seguridad:

1. Haz clic en el botón de menú lateral (`☰`) en la esquina superior derecha.
2. Dispones de tres opciones de descarga directa:
   * **📄 Exportar Movimientos (CSV):** Descarga el historial completo de préstamos, responsables, fechas y observaciones. Compatible con Microsoft Excel en español con caracteres y tildes exactos.
   * **📋 Exportar Inventario (CSV):** Descarga la relación de todo el parque deportivo registrado (códigos, deportes, estados y fechas de alta).
   * **💾 Exportar Respaldo (SQL):** Genera un volcado completo de la estructura y tablas de la base de datos para respaldo preventivo en discos externos o copias de seguridad de la institución.

---

## 5. Preguntas Frecuentes y Solución de Problemas (FAQ)

### ¿Por qué la pantalla se queda en "CONECTANDO BD…" o muestra error de conexión?
* **Causa:** El motor MySQL no está encendido en tu computadora.
* **Solución:** Abre el panel de control de **XAMPP**, busca la línea de **MySQL** y presiona el botón **`Start`**. Luego recarga la página en tu navegador (`F5`).

### ¿Por qué un balón no aparece en la lista para prestar?
* **Causa:** El balón ya se encuentra prestado a otra persona o está reportado como dañado.
* **Solución:** Ve a la pestaña **Movimientos**, verifica quién lo tiene a cargo y tramita su devolución previa antes de prestarlo nuevamente.

### ¿Por qué no aparece el botón de eliminar (papelera) en algunos balones del inventario?
* **Causa:** Como medida de seguridad contra borrados accidentales, el sistema bloquea la eliminación de balones que están disponibles o en préstamo activo.
* **Solución:** Para dar de baja un balón, este debe encontrarse en estado **Dañado**.

### ¿Cómo abro los reportes CSV en Excel si las tildes se ven alteradas en otras versiones?
* Todos los archivos CSV generados por el sistema incorporan codificación universal **UTF-8 con BOM** y separador estándar `;`. Al abrirlos con doble clic en Windows, Microsoft Excel los procesará en columnas de forma automática y con los caracteres correctos.

---

## 6. Glosario de Términos

| Término | Definición en el Sistema |
| :--- | :--- |
| **Código / Placa** | Identificador único alfanumérico institucional grabado en cada balón (ej. `INEM-001`). |
| **Disponible** | Balón en óptimas condiciones físicas y almacenado en el depósito, listo para ser prestado. |
| **Préstamo** | Balón que ha sido entregado a un docente, monitor o estudiante y se encuentra fuera del depósito. |
| **Devuelto** | Estado asignado a un registro de préstamo que ya fue retornado a conformidad al depósito. |
| **Dañado** | Implemento que presenta pinchazo, deformidad o avería y requiere reparación o baja definitiva. |
| **KPI (*Key Performance Indicator*)** | Métrica visual en tiempo real que muestra el total de balones por categoría de estado. |

---

*Manual elaborado para la comunidad educativa de la Institución Educativa INEM José Félix de Restrepo.*  
*Para soporte técnico adicional, comuníquese con el administrador del sistema deportivo institucional.*
