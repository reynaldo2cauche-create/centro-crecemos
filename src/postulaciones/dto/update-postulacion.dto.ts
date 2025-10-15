// entities/postulacion.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('postulaciones')
export class Postulacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'varchar', length: 100 })
  cargo_postulado: string;

  @Column({ type: 'text', nullable: true })
  mensaje: string;

  @Column({ type: 'varchar', length: 255 })
  cv_path: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cv_original_name: string;

  @Column({ 
    type: 'enum',
    enum: ['Nuevo', 'En revisión', 'Contactado', 'Por entrevistar', 'Rechazado', 'Contratado'],
    default: 'Nuevo'
  })
  estado_postulacion: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;
}

// dto/update-postulacion.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostulacionDto } from './create-postulacion.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdatePostulacionDto extends PartialType(CreatePostulacionDto) {
  @IsOptional()
  @IsEnum(['Nuevo', 'En revisión', 'Contactado', 'Por entrevistar', 'Rechazado', 'Contratado'])
  estado_postulacion?: 'Nuevo' | 'En revisión' | 'Contactado' | 'Por entrevistar' | 'Rechazado' | 'Contratado';
}