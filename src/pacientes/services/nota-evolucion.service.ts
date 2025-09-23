import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotaEvolucion } from '../entities/nota-evolucion.entity';
import { CreateNotaEvolucionDto } from '../dto/create-nota-evolucion.dto';
import { Paciente } from '../paciente.entity';

@Injectable()
export class NotaEvolucionService {
  constructor(
    @InjectRepository(NotaEvolucion)
    private notaEvolucionRepository: Repository<NotaEvolucion>,
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
  ) {}

  async create(dto: CreateNotaEvolucionDto) {
    console.log('dto', dto);
    const paciente = await this.pacienteRepository.findOne({ where: { id: dto.paciente_id } });
    if (!paciente) throw new Error('Paciente no encontrado');
    
    const nota = this.notaEvolucionRepository.create({
      paciente,
      entrevista: dto.entrevista,
      sesion_evaluacion: dto.sesion_evaluacion,
      sesion_terapias: dto.sesion_terapias,
      objetivos_terapeuticos: dto.objetivos_terapeuticos,
      observaciones: dto.observaciones,
      usuarioCreador: { id: dto.user_id_crea },
      fecha_crea: new Date(),
    });
    console.log('nota', nota);
    
    const notaGuardada = await this.notaEvolucionRepository.save(nota);
    
    // Obtener la nota con todas las relaciones para la respuesta
    const notaCompleta = await this.notaEvolucionRepository.findOne({
      where: { id: notaGuardada.id },
      relations: ['paciente', 'usuarioCreador', 'usuarioCreador.rol', 'usuarioCreador.especialidad']
    });
    
    return notaCompleta;
  }

  async findByPaciente(paciente_id: number, trabajador_id?: number) {
    const whereCondition: any = { 
      paciente: { id: paciente_id } 
    };

    // Si se proporciona trabajador_id, agregar el filtro
    if (trabajador_id) {
      whereCondition.usuarioCreador = { id: trabajador_id };
    }

    const notas = await this.notaEvolucionRepository.find({
      where: whereCondition,
      order: { fecha_crea: 'DESC' },
      relations: ['usuarioCreador', 'usuarioCreador.rol', 'usuarioCreador.especialidad']
    });

    return notas.map(nota => ({
      id: nota.id,
      entrevista: nota.entrevista,
      sesion_evaluacion: nota.sesion_evaluacion,
      sesion_terapias: nota.sesion_terapias,
      objetivos_terapeuticos: nota.objetivos_terapeuticos,
      observaciones: nota.observaciones,
      fecha_crea: nota.fecha_crea,
      trabajador: nota.usuarioCreador
        ? {
            nombres: nota.usuarioCreador.nombres,
            apellidos: nota.usuarioCreador.apellidos,
            especialidad: nota.usuarioCreador.especialidad,
            rol: nota.usuarioCreador.rol
          }
        : null
    }));
  }
} 