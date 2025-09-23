-- Script para crear la tabla entrevistas_padres limpia (solo campos necesarios)
-- Eliminar la tabla si existe
DROP TABLE IF EXISTS entrevistas_padres;

-- Crear la tabla entrevistas_padres
CREATE TABLE entrevistas_padres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  usuario_id INT NOT NULL,
  fecha DATE NOT NULL,
  escolaridad INT NOT NULL,
  motivo_consulta TEXT NOT NULL,
  otras_atenciones INT NULL,
  antecedentes_familiares VARCHAR(10) NOT NULL,
  antecedentes_medicos TEXT NULL,
  antecedentes_psiquiatricos TEXT NULL,
  antecedentes_toxicologicos TEXT NULL,
  relacion_entre_padres INT NULL,
  detalle_relacion_padres TEXT NULL,
  cantidad_hermanos VARCHAR(10) NOT NULL,
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
  recomendaciones TEXT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actua TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  user_id_actua INT NULL,
  activo BOOLEAN DEFAULT TRUE,
  
  -- Índices
  INDEX idx_paciente_id (paciente_id),
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_fecha (fecha),
  INDEX idx_activo (activo),
  
  -- Claves foráneas
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES trabajadores_centro(id) ON DELETE CASCADE,
  FOREIGN KEY (otras_atenciones) REFERENCES atenciones(id) ON DELETE SET NULL,
  FOREIGN KEY (relacion_entre_padres) REFERENCES relacion_padres(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id_actua) REFERENCES trabajadores_centro(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
