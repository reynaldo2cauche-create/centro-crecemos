-- Actualizar tabla asignacion_terapeuta para asegurar que tenga los campos necesarios
ALTER TABLE `asignacion_terapeuta` 
ADD COLUMN IF NOT EXISTS `activo` BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS `fecha_fin` DATE NULL,
ADD COLUMN IF NOT EXISTS `estado` VARCHAR(20) DEFAULT 'ACTIVO';

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS `idx_asignacion_terapeuta_paciente_servicio` ON `asignacion_terapeuta` (`paciente_servicio_id`);
CREATE INDEX IF NOT EXISTS `idx_asignacion_terapeuta_estado_activo` ON `asignacion_terapeuta` (`estado`, `activo`); 