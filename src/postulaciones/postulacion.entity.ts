import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('postulaciones')
export class Postulacion {
  @PrimaryGeneratedColumn()
  id_postulacion: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 15, nullable: true })
  telefono?: string;

  @Column({ length: 50 })
  cargo_postulado: string;

  @Column({ type: 'text', nullable: true })
  experiencia?: string;

  @Column({ length: 255, nullable: true })
  documentos_adjuntos?: string;

  @CreateDateColumn()
  fecha_postulacion: Date;

  @Column({ type: 'enum', enum: ['Recibida', 'En revisión', 'Aceptada', 'Rechazada'], default: 'Recibida' })
  estado_postulacion: string;
}
