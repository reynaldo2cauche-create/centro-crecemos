-- Crear tabla de tipos de archivo
CREATE TABLE IF NOT EXISTS tipos_archivo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de archivos digitales
CREATE TABLE IF NOT EXISTS archivos_digitales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    nombre_original VARCHAR(255) NOT NULL,
    tipo_mime VARCHAR(100) NOT NULL,
    tamano BIGINT NOT NULL,
    descripcion TEXT,
    ruta_archivo VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    paciente_id INT,
    terapeuta_id INT NOT NULL,
    tipo_archivo_id INT NOT NULL,
    
    -- Claves foráneas
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE SET NULL,
    FOREIGN KEY (terapeuta_id) REFERENCES trabajador_centro(id) ON DELETE CASCADE,
    FOREIGN KEY (tipo_archivo_id) REFERENCES tipos_archivo(id) ON DELETE RESTRICT,
    
    -- Índices para mejorar rendimiento
    INDEX idx_paciente_id (paciente_id),
    INDEX idx_terapeuta_id (terapeuta_id),
    INDEX idx_tipo_archivo_id (tipo_archivo_id),
    INDEX idx_fecha_creacion (fecha_creacion),
    INDEX idx_activo (activo)
);

-- Insertar tipos de archivo por defecto
INSERT INTO tipos_archivo (nombre, descripcion) VALUES
('Informe de evaluación', 'Informes de evaluación psicológica o terapéutica'),
('Receta médica', 'Recetas médicas y prescripciones'),
('Consentimiento informado', 'Documentos de consentimiento informado'),
('Historia clínica', 'Documentos de historia clínica'),
('Evaluación inicial', 'Evaluaciones iniciales de pacientes'),
('Plan de tratamiento', 'Planes de tratamiento terapéutico'),
('Notas de sesión', 'Notas de sesiones terapéuticas'),
('Otro', 'Otros tipos de documentos')
ON DUPLICATE KEY UPDATE
nombre = VALUES(nombre),
descripcion = VALUES(descripcion);
