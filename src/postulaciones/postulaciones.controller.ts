// postulaciones.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PostulacionesService } from './postulaciones.service';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';

@Controller('backend_api/postulaciones')
export class PostulacionesController {
  constructor(private readonly postulacionesService: PostulacionesService) {}

  // Crear nueva postulación con CV
  @Post()
  @UseInterceptors(FileInterceptor('cv', {
    storage: diskStorage({
      destination: './uploads/cvs',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `cv-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (file.mimetype !== 'application/pdf') {
        return callback(new BadRequestException('Solo se permiten archivos PDF'), false);
      }
      callback(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async crearPostulacion(
    @Body() createPostulacionDto: CreatePostulacionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.postulacionesService.crearPostulacion(createPostulacionDto, file);
  }

  // Obtener todas las postulaciones con filtros opcionales
  @Get()
  async obtenerPostulaciones(
    @Query('estado_postulacion') estado_postulacion?: string,
    @Query('cargo_postulado') cargo_postulado?: string,
    @Query('fecha_desde') fecha_desde?: string,
    @Query('fecha_hasta') fecha_hasta?: string,
  ) {
    const filtros = { estado_postulacion, cargo_postulado, fecha_desde, fecha_hasta };
    return await this.postulacionesService.obtenerPostulaciones(filtros);
  }

  // Obtener postulación por ID
  @Get(':id')
  async obtenerPostulacionPorId(@Param('id', ParseIntPipe) id: number) {
    return await this.postulacionesService.obtenerPostulacionPorId(id);
  }

  // ENDPOINT PRINCIPAL: Ver CV en el navegador (inline)
  @Get(':id/cv')
  async obtenerCV(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { stream, filename, mimetype } = await this.postulacionesService.obtenerCV(id);

    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });

    return new StreamableFile(stream);
  }

  // Descargar CV (attachment en lugar de inline)
  @Get(':id/cv/download')
  async descargarCV(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { stream, filename, mimetype } = await this.postulacionesService.obtenerCV(id);

    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    return new StreamableFile(stream);
  }

  // Actualizar solo el estado
  @Put(':id/estado')
  async actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
  ) {
    return await this.postulacionesService.actualizarEstado(id, estado);
  }

  // Eliminar postulación
  @Delete(':id')
  async eliminarPostulacion(@Param('id', ParseIntPipe) id: number) {
    return await this.postulacionesService.eliminarPostulacion(id);
  }
}