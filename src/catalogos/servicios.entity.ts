import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AreaServicio } from './area-servicio.entity';

@Entity()
export class Servicios {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AreaServicio)
  @JoinColumn({ name: 'area_id' })
  area: AreaServicio;

  @Column()
  nombre: string;

  @Column({ default: true })
  activo: boolean;
}