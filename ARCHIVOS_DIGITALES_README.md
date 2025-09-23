# Archivos Digitales - Historia Clínica

## Descripción
Esta funcionalidad permite gestionar archivos digitales asociados a la historia clínica de los pacientes. Los archivos pueden ser de diferentes tipos (informes, recetas, consentimientos, etc.) y están asociados a un terapeuta y opcionalmente a un paciente.

## Estructura de Base de Datos

### Tabla: `tipos_archivo`
- `id`: Identificador único
- `nombre`: Nombre del tipo de archivo
- `descripcion`: Descripción del tipo de archivo
- `activo`: Estado activo/inactivo
- `fecha_creacion`: Fecha de creación
- `fecha_actualizacion`: Fecha de última actualización

### Tabla: `archivos_digitales`
- `id`: Identificador único
- `nombre_archivo`: Nombre único del archivo en el servidor
- `nombre_original`: Nombre original del archivo
- `tipo_mime`: Tipo MIME del archivo
- `tamano`: Tamaño del archivo en bytes
- `descripcion`: Descripción del archivo
- `ruta_archivo`: Ruta relativa del archivo
- `activo`: Estado activo/inactivo
- `fecha_creacion`: Fecha de creación
- `fecha_actualizacion`: Fecha de última actualización
- `paciente_id`: ID del paciente (opcional)
- `terapeuta_id`: ID del terapeuta (requerido)
- `tipo_archivo_id`: ID del tipo de archivo (requerido)

## Endpoints Disponibles

### Archivos Digitales

#### POST `/archivos-digitales`
Subir un nuevo archivo digital.

**FormData:**
- `archivo`: Archivo a subir (requerido)
- `terapeutaId`: ID del terapeuta (requerido)
- `tipoArchivoId`: ID del tipo de archivo (requerido)
- `descripcion`: Descripción del archivo (opcional)
- `pacienteId`: ID del paciente (opcional)

**Tipos de archivo permitidos:**
- PDF
- Imágenes (JPEG, PNG, GIF)
- Documentos Word (.doc, .docx)
- Hojas de cálculo Excel (.xls, .xlsx)

**Límite de tamaño:** 10MB

#### GET `/archivos-digitales`
Obtener todos los archivos digitales.

**Query Parameters:**
- `pacienteId`: Filtrar por paciente
- `terapeutaId`: Filtrar por terapeuta

#### GET `/archivos-digitales/:id`
Obtener un archivo digital específico.

#### GET `/archivos-digitales/:id/download`
Descargar un archivo digital.

#### PATCH `/archivos-digitales/:id`
Actualizar información de un archivo digital.

#### DELETE `/archivos-digitales/:id`
Eliminar un archivo digital (marca como inactivo y elimina el archivo físico).

### Tipos de Archivo

#### GET `/archivos-digitales/tipos`
Obtener todos los tipos de archivo disponibles.

## Tipos de Archivo por Defecto

1. **Informe de evaluación** - Informes de evaluación psicológica o terapéutica
2. **Receta médica** - Recetas médicas y prescripciones
3. **Consentimiento informado** - Documentos de consentimiento informado
4. **Historia clínica** - Documentos de historia clínica
5. **Evaluación inicial** - Evaluaciones iniciales de pacientes
6. **Plan de tratamiento** - Planes de tratamiento terapéutico
7. **Notas de sesión** - Notas de sesiones terapéuticas
8. **Otro** - Otros tipos de documentos

## Ejemplo de Uso

### Subir un archivo
```javascript
const formData = new FormData();
formData.append('archivo', file);
formData.append('terapeutaId', '123');
formData.append('tipoArchivoId', '1');
formData.append('descripcion', 'Informe de evaluación inicial');
formData.append('pacienteId', '456');

fetch('/archivos-digitales', {
  method: 'POST',
  body: formData
});
```

### Obtener archivos de un paciente
```javascript
fetch('/archivos-digitales?pacienteId=456')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Descargar un archivo
```javascript
window.open('/archivos-digitales/123/download');
```

## Configuración

### Carpeta de Uploads
Los archivos se guardan en la carpeta `uploads/` en la raíz del proyecto. Esta carpeta debe existir y tener permisos de escritura.

### Configuración de Multer
- **Límite de tamaño:** 10MB
- **Tipos permitidos:** PDF, imágenes, documentos Word y Excel
- **Almacenamiento:** Sistema de archivos local

## Seguridad

- Validación de tipos de archivo
- Límite de tamaño de archivo
- Nombres únicos para evitar conflictos
- Verificación de existencia de entidades relacionadas
- Eliminación segura (marca como inactivo en BD y elimina archivo físico)

## Notas Importantes

1. Los archivos se guardan con nombres únicos generados con UUID para evitar conflictos
2. Al eliminar un archivo, se marca como inactivo en la base de datos y se elimina el archivo físico
3. Los tipos de archivo se cargan desde la base de datos y no se pueden modificar desde la API
4. La carpeta `uploads/` debe existir y tener permisos de escritura
5. Se recomienda configurar un respaldo regular de la carpeta de uploads
