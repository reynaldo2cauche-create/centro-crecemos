-- Script para actualizar el campo servicio en la tabla reportes_evolucion
-- Cambiar de texto a foreign key que referencia a la tabla servicios

-- 1. Agregar la nueva columna servicio_id
ALTER TABLE reportes_evolucion 
ADD COLUMN servicio_id INT NULL;

-- 2. Agregar la foreign key constraint
ALTER TABLE reportes_evolucion 
ADD CONSTRAINT fk_reportes_evolucion_servicio 
FOREIGN KEY (servicio_id) REFERENCES servicios(id);

-- 3. Crear un índice para mejorar el rendimiento
CREATE INDEX idx_reportes_evolucion_servicio_id ON reportes_evolucion(servicio_id);

-- 4. Eliminar la columna servicio anterior (texto)
ALTER TABLE reportes_evolucion DROP COLUMN servicio;

-- Nota: Si quieres migrar datos existentes del campo servicio (texto) 
-- a la nueva relación, necesitarías un script adicional que mapee
-- los nombres de servicios existentes a los IDs correspondientes
-- en la tabla servicios.
