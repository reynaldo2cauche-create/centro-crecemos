import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from '../paciente.entity';
import { TrabajadorCentro } from '../../usuarios/trabajador-centro.entity';

@Entity('nota_evolucion')
export class NotaEvolucion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Paciente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column({ type: 'text', nullable: true })
  entrevista: string;

  @Column({ type: 'text', nullable: true })
  sesion_evaluacion: string;

  @Column({ type: 'text', nullable: true })
  sesion_terapias: string;

  @Column({ type: 'text', nullable: true })
  objetivos_terapeuticos: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_crea: Date;

  @ManyToOne(() => TrabajadorCentro, { nullable: true })
  @JoinColumn({ name: 'user_id_crea' })
  usuarioCreador: TrabajadorCentro;

  

} 