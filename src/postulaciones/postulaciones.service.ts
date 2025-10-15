// postulaciones.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Postulacion } from './postulacion.entity';
import { CreatePostulacionDto } from './dto/create-postulacion.dto';
import { UpdatePostulacionDto } from './dto/update-postulacion.dto';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class PostulacionesService {
  private readonly uploadsPath = './uploads/cvs';

  constructor(
    @InjectRepository(Postulacion)
    private readonly postulacionesRepository: Repository<Postulacion>,
  ) {
    this.ensureUploadsFolderExists();
  }

  private async ensureUploadsFolderExists() {
    try {
      await fs.mkdir(this.uploadsPath, { recursive: true });
    } catch (error) {
      console.error('Error creando carpeta de uploads:', error);
    }
  }

  async crearPostulacion(
    createPostulacionDto: CreatePostulacionDto,
    cvFile?: Express.Multer.File,
  ) {
    try {
      if (!cvFile) {
        throw new BadRequestException('El CV es requerido');
      }

      const postulacion = this.postulacionesRepository.create({
        nombre: createPostulacionDto.nombre,
        apellido: createPostulacionDto.apellido,
        email: createPostulacionDto.email,
        telefono: createPostulacionDto.telefono,
        cargo_postulado: createPostulacionDto.cargo_postulado,
        experiencia: createPostulacionDto.experiencia,
        documentos_adjuntos: cvFile.filename,
      });

      return await this.postulacionesRepository.save(postulacion);
    } catch (error) {
      if (cvFile?.filename) {
        await this.eliminarArchivo(cvFile.filename);
      }
      throw error;
    }
  }

  async obtenerPostulaciones(filtros: any = {}) {
    try {
      const query = this.postulacionesRepository.createQueryBuilder('postulacion');

      if (filtros.estado_postulacion) {
        query.andWhere('postulacion.estado_postulacion = :estado', {
          estado: filtros.estado_postulacion,
        });
      }

      if (filtros.cargo_postulado) {
        query.andWhere('postulacion.cargo_postulado LIKE :cargo', {
          cargo: `%${filtros.cargo_postulado}%`,
        });
      }

      if (filtros.fecha_desde && filtros.fecha_hasta) {
        query.andWhere('postulacion.fecha_postulacion BETWEEN :desde AND :hasta', {
          desde: filtros.fecha_desde,
          hasta: filtros.fecha_hasta,
        });
      }

      query.orderBy('postulacion.fecha_postulacion', 'DESC');
      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener postulaciones');
    }
  }

  async obtenerPostulacionPorId(id: number) {
    const postulacion = await this.postulacionesRepository.findOne({
      where: { id_postulacion: id },
    });

    if (!postulacion) {
      throw new NotFoundException(`Postulación con ID ${id} no encontrada`);
    }

    return postulacion;
  }

  async obtenerCV(id: number) {
    const postulacion = await this.obtenerPostulacionPorId(id);

    if (!postulacion.documentos_adjuntos) {
      throw new NotFoundException('Esta postulación no tiene CV asociado');
    }

    const filePath = join(process.cwd(), this.uploadsPath, postulacion.documentos_adjuntos);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Archivo CV no encontrado en el servidor');
    }

    const file = createReadStream(filePath);

    return {
      stream: file,
      filename: postulacion.documentos_adjuntos,
      mimetype: 'application/pdf',
    };
  }

  async actualizarEstado(id: number, estado: string) {
    const validStates = ['Nuevo', 'En revisión', 'Contactado', 'Por entrevistar','Rechazado', 'Contratado'];
        if (!validStates.includes(estado)) {
      throw new BadRequestException(
        `Estado inválido. Debe ser uno de: ${validStates.join(', ')}`
      );
    }

    const postulacion = await this.obtenerPostulacionPorId(id);
    postulacion.estado_postulacion = estado;

    return await this.postulacionesRepository.save(postulacion);
  }

  async eliminarPostulacion(id: number) {
    const postulacion = await this.obtenerPostulacionPorId(id);

    if (postulacion.documentos_adjuntos) {
      await this.eliminarArchivo(postulacion.documentos_adjuntos);
    }

    await this.postulacionesRepository.remove(postulacion);

    return {
      success: true,
      message: 'Postulación eliminada correctamente',
    };
  }

  private async eliminarArchivo(filename: string): Promise<void> {
    try {
      const filePath = join(process.cwd(), this.uploadsPath, filename);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Error eliminando archivo ${filename}:`, error);
    }
  }
}