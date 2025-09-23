-- Script para crear las tablas de hermanos y familiares

-- 1. Crear tabla hermanos_entrevista
CREATE TABLE hermanos_entrevista (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entrevista_id INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    edad INT NOT NULL,
    sexo_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (entrevista_id) REFERENCES entrevistas_padres(id),
    FOREIGN KEY (sexo_id) REFERENCES sexo(id)
);

-- 2. Crear tabla familiares_entrevista
CREATE TABLE familiares_entrevista (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entrevista_id INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    ocupacion_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (entrevista_id) REFERENCES entrevistas_padres(id),
    FOREIGN KEY (ocupacion_id) REFERENCES ocupaciones(id)
);

-- 3. Eliminar columnas JSON de entrevistas_padres
ALTER TABLE entrevistas_padres 
DROP COLUMN hermanos,
DROP COLUMN familiares;

-- 4. Crear índices para mejorar el rendimiento
CREATE INDEX idx_hermanos_entrevista_entrevista_id ON hermanos_entrevista(entrevista_id);
CREATE INDEX idx_hermanos_entrevista_activo ON hermanos_entrevista(activo);
CREATE INDEX idx_familiares_entrevista_entrevista_id ON familiares_entrevista(entrevista_id);
CREATE INDEX idx_familiares_entrevista_activo ON familiares_entrevista(activo);
