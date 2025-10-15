import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cita } from './cita.entity';
import { Paciente } from '../pacientes/paciente.entity';
import { TrabajadorCentro } from '../usuarios/trabajador-centro.entity';
import { Servicios } from '../catalogos/servicios.entity';
import { MotivoCita } from '../catalogos/motivo-cita.entity';
import { EstadoCita } from '../catalogos/estado-cita.entity';

@Entity('historial_citas')
export class HistorialCita {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cita)
  @JoinColumn({ name: 'cita_id' })
  cita: Cita;

  @Column({ type: 'int' })
  cita_id: number;

  // Datos de la cita en el momento del registro
  @ManyToOne(() => Paciente, { eager: true })
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => TrabajadorCentro, { eager: true })
  @JoinColumn({ name: 'doctor_id' })
  doctor: TrabajadorCentro;

  @ManyToOne(() => Servicios, { eager: true })
  @JoinColumn({ name: 'servicio_id' })
  servicio: Servicios;

  @ManyToOne(() => MotivoCita, { eager: true })
  @JoinColumn({ name: 'motivo_id' })
  motivo: MotivoCita;

  @ManyToOne(() => EstadoCita, { eager: true })
  @JoinColumn({ name: 'estado_id' })
  estado: EstadoCita;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time', nullable: true })
  hora_fin: string;

  @Column({ type: 'int' })
  duracion_minutos: number;

  @Column({ type: 'text', nullable: true })
  nota: string;

  // Información de auditoría
  @Column({ 
    type: 'enum', 
    enum: ['CREATE', 'UPDATE', 'DELETE'],
    comment: 'Tipo de operación realizada'
  })
  tipo_operacion: string;

  @Column({ type: 'int', nullable: true, comment: 'Usuario que realizó la operación' })
  usuario_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', comment: 'Fecha y hora del registro' })
  fecha_registro: Date;

  @Column({ type: 'text', nullable: true, comment: 'Descripción de los cambios realizados' })
  descripcion_cambios: string;
}

