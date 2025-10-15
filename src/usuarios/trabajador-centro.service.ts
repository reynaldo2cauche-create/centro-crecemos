import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrabajadorCentro } from './trabajador-centro.entity';
import { CreateTrabajadorCentroDto } from './dto/create-trabajador-centro.dto';
import { UpdateTrabajadorCentroDto } from './dto/update-trabajador-centro.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TrabajadorCentroService {
  constructor(
    @InjectRepository(TrabajadorCentro)
    private trabajadorCentroRepository: Repository<TrabajadorCentro>,
  ) {}

  findAll() {
    return this.trabajadorCentroRepository.find();
  }

  /**
   * Obtiene trabajadores activos solo con datos necesarios para select
   * @returns Array con id, nombre_completo y cargo
   */
  async findAllForSelect(): Promise<{ id: number; nombre_completo: string; cargo: string }[]> {
    const trabajadores = await this.trabajadorCentroRepository.find({
      select: ['id', 'nombres', 'apellidos', 'rol'],
      relations: ['rol'],
      where: { estado: true },
      order: { apellidos: 'ASC', nombres: 'ASC' }
    });

    return trabajadores.map(trabajador => ({
      id: trabajador.id,
      nombre_completo: `${trabajador.nombres} ${trabajador.apellidos}`.trim(),
      cargo: trabajador.rol?.nombre || 'Sin cargo'
    }));
  }

  async create(dto: CreateTrabajadorCentroDto) {
    console.log('DTO recibido:', dto);
    console.log('Password:', dto.password);
    
    if (!dto.password) {
      throw new Error('Password es requerido');
    }
    
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const trabajador = this.trabajadorCentroRepository.create({
      ...dto,
      password: hashedPassword,
      estado: true,
      rol: dto.rol_id ? { id: dto.rol_id } : undefined,
      especialidad: dto.especialidad_id ? { id: dto.especialidad_id } : undefined
    });
    
    const savedTrabajador = await this.trabajadorCentroRepository.save(trabajador);
    
    // Obtener el trabajador con todas las relaciones para la respuesta
    const trabajadorCompleto = await this.trabajadorCentroRepository.findOne({
      where: { id: savedTrabajador.id },
      relations: ['rol', 'especialidad']
    });
    
    // Devolver sin la contraseña y con los datos del rol y especialidad
    const { password, ...trabajadorSinPassword } = trabajadorCompleto;
    return {
      ...trabajadorSinPassword,
      rol: trabajadorCompleto.rol ? { 
        id: trabajadorCompleto.rol.id, 
        nombre: trabajadorCompleto.rol.nombre, 
        descripcion: trabajadorCompleto.rol.descripcion 
      } : null,
      especialidad: trabajadorCompleto.especialidad ? { 
        id: trabajadorCompleto.especialidad.id, 
        nombre: trabajadorCompleto.especialidad.nombre, 
        descripcion: trabajadorCompleto.especialidad.descripcion, 
        activo: trabajadorCompleto.especialidad.activo 
      } : null
    };
  }

  async update(id: number, dto: UpdateTrabajadorCentroDto) {
    console.log('Update Trabajador - ID:', id);
    console.log('Update Trabajador - DTO:', dto);
    
    const trabajador = await this.trabajadorCentroRepository.findOne({ 
      where: { id },
      relations: ['rol', 'especialidad', 'institucion']
    });
    
    if (!trabajador) throw new NotFoundException('Trabajador no encontrado');
    
    // Crear objeto de actualización
    const updateData: any = {};
    
    // Campos básicos
    if (dto.nombres !== undefined) updateData.nombres = dto.nombres;
    if (dto.apellidos !== undefined) updateData.apellidos = dto.apellidos;
    if (dto.dni !== undefined) updateData.dni = dto.dni;
    if (dto.username !== undefined) updateData.username = dto.username;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.cargo !== undefined) updateData.cargo = dto.cargo;
    
    // Password
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }
    
    // Relaciones
    if (dto.rol_id !== undefined) updateData.rol = { id: dto.rol_id };
    if (dto.especialidad_id !== undefined) updateData.especialidad = { id: dto.especialidad_id };
    if (dto.institucion_id !== undefined) updateData.institucion = { id: dto.institucion_id };
    
    console.log('Update Trabajador - Data a actualizar:', updateData);
    
    // Actualizar usando update
    await this.trabajadorCentroRepository.update(id, updateData);
    
    // Obtener el trabajador actualizado con sus relaciones
    const resultado = await this.trabajadorCentroRepository.findOne({
      where: { id },
      relations: ['rol', 'especialidad', 'institucion']
    });
    
    console.log('Update Trabajador - Resultado:', resultado);
    
    // Devolver sin la contraseña y con los datos del rol y especialidad
    const { password, ...trabajadorSinPassword } = resultado;
    return {
      ...trabajadorSinPassword,
      rol: resultado.rol ? { 
        id: resultado.rol.id, 
        nombre: resultado.rol.nombre, 
        descripcion: resultado.rol.descripcion 
      } : null,
      especialidad: resultado.especialidad ? { 
        id: resultado.especialidad.id, 
        nombre: resultado.especialidad.nombre, 
        descripcion: resultado.especialidad.descripcion, 
        activo: resultado.especialidad.activo 
      } : null
    };
  }

  async setEstado(id: number, estado: boolean) {
    const trabajador = await this.trabajadorCentroRepository.findOne({ where: { id } });
    if (!trabajador) throw new NotFoundException('Trabajador no encontrado');
    trabajador.estado = estado;
    return this.trabajadorCentroRepository.save(trabajador);
  }

  async findOneById(id: number) {
    const user = await this.trabajadorCentroRepository.findOne({ where: { id } });
    if (!user) return null;
    const { password, rol, especialidad, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      rol: rol ? { id: rol.id, nombre: rol.nombre, descripcion: rol.descripcion } : null,
      especialidad: especialidad ? { id: especialidad.id, nombre: especialidad.nombre, descripcion: especialidad.descripcion, activo: especialidad.activo } : null
    };
  }

  
} 