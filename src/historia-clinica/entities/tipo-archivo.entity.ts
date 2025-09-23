import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ArchivoDigital } from './archivo-digital.entity';

@Entity('tipos_archivo')
export class TipoArchivo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre', type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ name: 'fecha_actualizacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  fechaActualizacion: Date;

  @OneToMany(() => ArchivoDigital, archivoDigital => archivoDigital.tipoArchivo)
  archivosDigitales: ArchivoDigital[];
}
