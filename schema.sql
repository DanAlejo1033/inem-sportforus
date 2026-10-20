-- ══════════════════════════════════════════════════════
--  INEM SportForUs — Base de datos MySQL
--  Ejecutar una sola vez para crear la estructura
-- ══════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS inem_balones
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE inem_balones;

-- ── Tabla de balones (inventario) ──────────────────────
CREATE TABLE IF NOT EXISTS balones (
  id        INT          AUTO_INCREMENT PRIMARY KEY,
  codigo    VARCHAR(30)  NOT NULL UNIQUE,
  tipo      VARCHAR(50)  NOT NULL,
  estado    ENUM('Disponible','Préstamo','Dañado') NOT NULL DEFAULT 'Disponible',
  obs       TEXT         DEFAULT NULL,
  creado_en DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Tabla de movimientos ────────────────────────────────
CREATE TABLE IF NOT EXISTS movimientos (
  id         CHAR(36)     PRIMARY KEY,
  codigo     VARCHAR(30)  NOT NULL,
  tipo       VARCHAR(50)  NOT NULL,
  persona    VARCHAR(120) DEFAULT NULL,
  documento  VARCHAR(50)  DEFAULT NULL,
  area       VARCHAR(80)  DEFAULT NULL,
  docente    VARCHAR(120) DEFAULT NULL,
  obs        TEXT         DEFAULT NULL,
  estado     ENUM('Disponible','Préstamo','Dañado','Devuelto') NOT NULL,
  fecha      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_balon FOREIGN KEY (codigo) REFERENCES balones(codigo) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ── Tabla de encargados (usuarios y responsables) ─────────
CREATE TABLE IF NOT EXISTS encargados (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  usuario    VARCHAR(50)  NOT NULL UNIQUE,
  correo     VARCHAR(120) NOT NULL UNIQUE,
  nombre     VARCHAR(120) NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  cargo      ENUM('Estudiante','Profesor') NOT NULL DEFAULT 'Estudiante',
  creado_en  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Datos de demostración ───────────────────────────────
INSERT INTO balones (codigo, tipo, estado, obs) VALUES
('INEM-001', 'Fútbol', 'Disponible', 'En buen estado, listo para clase'),
('INEM-002', 'Fútbol', 'Disponible', 'Marca Golty, presión óptima'),
('INEM-003', 'Fútbol', 'Préstamo', 'Entregado a grado 11-1'),
('INEM-004', 'Fútbol', 'Dañado', 'Pinchado en la válvula'),
('INEM-005', 'Fútbol', 'Disponible', 'Balón de cuero sintético'),
('INEM-006', 'Microfútbol', 'Disponible', 'Balón pesado de sala'),
('INEM-007', 'Microfútbol', 'Préstamo', 'Préstamo para torneo interno'),
('INEM-008', 'Microfútbol', 'Disponible', 'Excelente estado'),
('INEM-009', 'Microfútbol', 'Dañado', 'Costura descosida lateral'),
('INEM-010', 'Microfútbol', 'Disponible', 'Marca Penalty'),
('INEM-011', 'Baloncesto', 'Disponible', 'Tamaño #7 profesional'),
('INEM-012', 'Baloncesto', 'Préstamo', 'Clase de educación física 9-3'),
('INEM-013', 'Baloncesto', 'Disponible', 'Agarre desgastado pero funcional'),
('INEM-014', 'Baloncesto', 'Dañado', 'Deformado / no rebota bien'),
('INEM-015', 'Baloncesto', 'Disponible', 'Marca Molten #7'),
('INEM-016', 'Voleibol', 'Disponible', 'Balón suave para entrenamiento'),
('INEM-017', 'Voleibol', 'Préstamo', 'Selección femenina de voleibol'),
('INEM-018', 'Voleibol', 'Disponible', 'Marca Mikasa'),
('INEM-019', 'Voleibol', 'Dañado', 'Pinchadura por objeto punzante'),
('INEM-020', 'Voleibol', 'Disponible', 'Nuevo en inventario');

INSERT INTO encargados (usuario, correo, nombre, contrasena, cargo) VALUES
('profesor.carlos', 'carlos.restrepo@inemjose.edu.co', 'Carlos Alberto Restrepo', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeN0sB/G5Qz6I3mR1uQ4Gg3zMh1s4g2O2', 'Profesor'),
('monitor.juan', 'juan.perez@inemjose.edu.co', 'Juan Camilo Pérez', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeN0sB/G5Qz6I3mR1uQ4Gg3zMh1s4g2O2', 'Estudiante');
