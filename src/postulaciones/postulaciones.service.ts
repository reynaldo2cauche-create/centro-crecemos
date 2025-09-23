import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Postulacion } from './postulacion.entity'; // Entidad creada para la tabla
import { CreatePostulacionDto } from './dto/create-postulacion.dto';

@Injectable()
export class PostulacionesService {
  constructor(
    @InjectRepository(Postulacion)
    private postulacionRepository: Repository<Postulacion>,
  ) {}

  async insertarPostulacion(data: CreatePostulacionDto): Promise<Postulacion> {
    const nuevaPostulacion = this.postulacionRepository.create(data);
    return await this.postulacionRepository.save(nuevaPostulacion);
  }
}
