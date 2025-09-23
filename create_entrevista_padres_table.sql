-- Script para crear la tabla entrevistas_padres
CREATE TABLE entrevistas_padres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha DATE NULL,
    lugar_nacimiento VARCHAR(200) NULL,
    escolaridad VARCHAR(100) NULL,
    colegio VARCHAR(200) NULL,
    nombre_madre VARCHAR(200) NULL,
    edad_madre INT NULL,
    ocupacion_madre VARCHAR(200) NULL,
    nombre_padre VARCHAR(200) NULL,
    edad_padre INT NULL,
    ocupacion_padre VARCHAR(200) NULL,
    lugar_entre_hermanos VARCHAR(50) NULL,
    es_hijo_unico BOOLEAN DEFAULT FALSE,
    motivo_consulta TEXT NULL,
    presuncion_diagnostica TEXT NULL,
    recomendaciones TEXT NULL,
    derivacion_interna VARCHAR(200) NULL,
    derivacion_externa VARCHAR(200) NULL,
    frecuencia VARCHAR(100) NULL,
    sesiones_evaluacion VARCHAR(100) NULL,
    tiempo_aproximado_terapia VARCHAR(100) NULL,
    objetivos_primer_periodo TEXT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actua TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id_actua INT NULL,
    activo BOOLEAN DEFAULT TRUE,
    
    -- Foreign Keys
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY (usuario_id) REFERENCES trabajadores_centro(id),
    FOREIGN KEY (user_id_actua) REFERENCES trabajadores_centro(id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_entrevistas_padres_paciente_id ON entrevistas_padres(paciente_id);
CREATE INDEX idx_entrevistas_padres_usuario_id ON entrevistas_padres(usuario_id);
CREATE INDEX idx_entrevistas_padres_fecha ON entrevistas_padres(fecha);
CREATE INDEX idx_entrevistas_padres_activo ON entrevistas_padres(activo);
