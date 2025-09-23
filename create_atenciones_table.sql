-- Script para crear la tabla atenciones e insertar los datos

-- 1. Crear la tabla
CREATE TABLE atenciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Insertar los datos de atenciones
INSERT INTO atenciones (nombre, descripcion) VALUES
('Terapia de Lenguaje', 'Intervención especializada para el desarrollo y rehabilitación del lenguaje'),
('Terapia Ocupacional', 'Terapia enfocada en el desarrollo de habilidades funcionales y ocupacionales'),
('Psicología Infantil y de Adolescentes', 'Atención psicológica especializada para niños y adolescentes'),
('Terapia Conductual y Sensorial', 'Intervención para el manejo de conductas y procesamiento sensorial'),
('Escolar (antes Maestra Sombra)', 'Apoyo educativo individualizado en el entorno escolar'),
('Terapia Familiar y de Pareja', 'Intervención terapéutica para familias y parejas'),
('Evaluaciones Psicológicas y Psicopedagógicas', 'Procesos de evaluación y diagnóstico psicológico y psicopedagógico'),
('Orientación a Padres', 'Asesoramiento y guía para padres y cuidadores'),
('Neuropediatra', 'Atención médica especializada en neurología pediátrica'),
('Neuropsicólogo', 'Evaluación y tratamiento de funciones cognitivas y cerebrales');

-- 3. Crear índices para mejorar el rendimiento
CREATE INDEX idx_atenciones_activo ON atenciones(activo);
CREATE INDEX idx_atenciones_nombre ON atenciones(nombre);
CREATE INDEX idx_atenciones_fecha_creacion ON atenciones(fecha_creacion);
