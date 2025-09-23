-- Script para crear la tabla grados_escolares e insertar los datos

-- 1. Crear la tabla
CREATE TABLE grados_escolares (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nivel VARCHAR(50) NULL,
    orden INT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- 2. Insertar los datos de grados escolares
INSERT INTO grados_escolares (nombre, nivel, orden) VALUES
('1er grado de primaria', 'primaria', 1),
('2do grado de primaria', 'primaria', 2),
('3er grado de primaria', 'primaria', 3),
('4to grado de primaria', 'primaria', 4),
('5to grado de primaria', 'primaria', 5),
('6to grado de primaria', 'primaria', 6),
('1er grado de secundaria', 'secundaria', 7),
('2do grado de secundaria', 'secundaria', 8),
('3er grado de secundaria', 'secundaria', 9),
('4to grado de secundaria', 'secundaria', 10),
('5to grado de secundaria', 'secundaria', 11);

-- 3. Crear índice para mejorar el rendimiento
CREATE INDEX idx_grados_escolares_activo ON grados_escolares(activo);
CREATE INDEX idx_grados_escolares_orden ON grados_escolares(orden);
CREATE INDEX idx_grados_escolares_nivel ON grados_escolares(nivel);
