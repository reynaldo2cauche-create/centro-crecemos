import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostulacionesService } from './postulaciones.service';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Controller('backend_api/postulaciones')
export class PostulacionesController {
  constructor(private readonly postulacionesService: PostulacionesService) {}

  // Endpoint para crear una postulación y subir un archivo adjunto
  @Post()
  @UseInterceptors(
    FileInterceptor('documento', {
      dest: './uploads',  // Carpeta donde se almacenarán los archivos
      limits: { fileSize: 5 * 1024 * 1024 },  // Limite de 5MB
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {  // Permite solo ciertos tipos de archivo
          return callback(new Error('Solo se permiten imágenes o archivos PDF'), false);
        }
        callback(null, true);
      }
    }),
  )
  async crearPostulacion(
    @Body() createPostulacionDto: CreatePostulacionDto, 
    @UploadedFile() file: Express.Multer.File, // Archivo subido
  ) {
    // Generar nombre único para el archivo y guardar la ruta
    if (file) {
      const uniqueFileName = uuidv4() + path.extname(file.originalname);
      const filePath = path.join('uploads', uniqueFileName);

      // Mover el archivo a su destino
      fs.renameSync(file.path, filePath);

      // Añadir la ruta del archivo al DTO de la postulación
      createPostulacionDto.documentos_adjuntos = filePath;
    }

    return await this.postulacionesService.insertarPostulacion(createPostulacionDto);
  }
}
