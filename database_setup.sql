-- Script para crear las tablas del sistema de terapias múltiples
-- Ejecutar en la base de datos centro_terapias

-- Tabla para la relación paciente-servicio
CREATE TABLE IF NOT EXISTS paciente_servicio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_id INT NOT NULL,
  servicio_id INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NULL,
  estado VARCHAR(20) DEFAULT 'ACTIVO',
  motivo_consulta TEXT NULL,
  observaciones TEXT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES paciente(id) ON DELETE CASCADE,
  FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);

-- Tabla para asignaciones de terapeutas
CREATE TABLE IF NOT EXISTS asignacion_terapeuta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_servicio_id INT NOT NULL,
  terapeuta_id INT NOT NULL,
  fecha_asignacion DATE NOT NULL,
  fecha_fin DATE NULL,
  estado VARCHAR(20) DEFAULT 'ACTIVO',
  observaciones TEXT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_servicio_id) REFERENCES paciente_servicio(id) ON DELETE CASCADE,
  FOREIGN KEY (terapeuta_id) REFERENCES trabajador_centro(id)
);

-- Tabla para historias clínicas
CREATE TABLE IF NOT EXISTS historia_clinica (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_servicio_id INT NOT NULL,
  terapeuta_id INT NOT NULL,
  fecha_sesion DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  objetivo_sesion TEXT NOT NULL,
  actividades_realizadas TEXT NOT NULL,
  observaciones TEXT NOT NULL,
  tareas_casa TEXT NULL,
  recomendaciones TEXT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_servicio_id) REFERENCES paciente_servicio(id) ON DELETE CASCADE,
  FOREIGN KEY (terapeuta_id) REFERENCES trabajador_centro(id)
);

-- Tabla para comentarios de terapia
CREATE TABLE IF NOT EXISTS comentario_terapia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente_servicio_id INT NOT NULL,
  terapeuta_id INT NOT NULL,
  comentario TEXT NOT NULL,
  tipo VARCHAR(20) DEFAULT 'GENERAL',
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_servicio_id) REFERENCES paciente_servicio(id) ON DELETE CASCADE,
  FOREIGN KEY (terapeuta_id) REFERENCES trabajador_centro(id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_paciente_servicio_paciente ON paciente_servicio(paciente_id);
CREATE INDEX idx_paciente_servicio_servicio ON paciente_servicio(servicio_id);
CREATE INDEX idx_asignacion_terapeuta_paciente_servicio ON asignacion_terapeuta(paciente_servicio_id);
CREATE INDEX idx_asignacion_terapeuta_terapeuta ON asignacion_terapeuta(terapeuta_id);
CREATE INDEX idx_historia_clinica_paciente_servicio ON historia_clinica(paciente_servicio_id);
CREATE INDEX idx_historia_clinica_terapeuta ON historia_clinica(terapeuta_id);
CREATE INDEX idx_comentario_terapia_paciente_servicio ON comentario_terapia(paciente_servicio_id);
CREATE INDEX idx_comentario_terapia_terapeuta ON comentario_terapia(terapeuta_id); 