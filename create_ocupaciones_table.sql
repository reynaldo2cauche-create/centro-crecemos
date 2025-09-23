-- Script para crear la tabla ocupaciones e insertar los datos

-- 1. Crear la tabla
CREATE TABLE ocupaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Insertar los datos de ocupaciones
INSERT INTO ocupaciones (nombre, descripcion) VALUES
('Ama de casa', 'Persona que se dedica al cuidado del hogar y la familia'),
('Profesional', 'Persona con título profesional que ejerce su profesión'),
('Comerciante', 'Persona que se dedica al comercio o venta de productos'),
('Empleado', 'Persona que trabaja por cuenta ajena en una empresa'),
('Estudiante', 'Persona que se dedica principalmente a estudiar'),
('Jubilado', 'Persona que ha terminado su vida laboral activa'),
('Otro', 'Otra ocupación no especificada en las opciones anteriores');

-- 3. Crear índices para mejorar el rendimiento
CREATE INDEX idx_ocupaciones_activo ON ocupaciones(activo);
CREATE INDEX idx_ocupaciones_nombre ON ocupaciones(nombre);
CREATE INDEX idx_ocupaciones_fecha_creacion ON ocupaciones(fecha_creacion);
