-- Script final para crear la tabla entrevistas_padres con todos los campos

-- 1. Crear la tabla
CREATE TABLE entrevistas_padres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha DATE NULL,
    lugar_nacimiento VARCHAR(200) NULL,
    escolaridad INT NULL,
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
    
    -- Nuevos campos agregados
    otras_atenciones INT NULL,
    relacion_madre VARCHAR(100) NULL,
    antecedentes_familiares VARCHAR(10) NULL,
    antecedentes_medicos TEXT NULL,
    antecedentes_psiquiatricos TEXT NULL,
    antecedentes_toxicologicos TEXT NULL,
    relacion_entre_padres INT NULL,
    detalle_relacion_padres TEXT NULL,
    cantidad_hermanos VARCHAR(10) NULL,
    hermanos JSON NULL,
    familiares JSON NULL,
    tiempo_juego VARCHAR(100) NULL,
    tiempo_dispositivos VARCHAR(100) NULL,
    antecedentes_prenatales TEXT NULL,
    desarrollo_motor TEXT NULL,
    desarrollo_lenguaje TEXT NULL,
    alimentacion TEXT NULL,
    sueno TEXT NULL,
    control_esfinteres TEXT NULL,
    antecedentes_medicos_nino TEXT NULL,
    antecedentes_escolares TEXT NULL,
    relacion_pares VARCHAR(100) NULL,
    expresion_emocional TEXT NULL,
    relacion_autoridad TEXT NULL,
    juegos_preferidos TEXT NULL,
    actividades_favoritas TEXT NULL,
    
    -- Campos de auditoría
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actua TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id_actua INT NULL,
    activo BOOLEAN DEFAULT TRUE,
    
    -- Foreign Keys (corregidos con nombres de tablas en plural)
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY (usuario_id) REFERENCES trabajadores_centro(id),
    FOREIGN KEY (user_id_actua) REFERENCES trabajadores_centro(id)
);

-- 2. Crear índices para mejorar el rendimiento
CREATE INDEX idx_entrevistas_padres_paciente_id ON entrevistas_padres(paciente_id);
CREATE INDEX idx_entrevistas_padres_usuario_id ON entrevistas_padres(usuario_id);
CREATE INDEX idx_entrevistas_padres_fecha ON entrevistas_padres(fecha);
CREATE INDEX idx_entrevistas_padres_activo ON entrevistas_padres(activo);
CREATE INDEX idx_entrevistas_padres_otras_atenciones ON entrevistas_padres(otras_atenciones);
CREATE INDEX idx_entrevistas_padres_relacion_entre_padres ON entrevistas_padres(relacion_entre_padres);
CREATE INDEX idx_entrevistas_padres_antecedentes_familiares ON entrevistas_padres(antecedentes_familiares);
CREATE INDEX idx_entrevistas_padres_relacion_madre ON entrevistas_padres(relacion_madre);
CREATE INDEX idx_entrevistas_padres_relacion_pares ON entrevistas_padres(relacion_pares);
