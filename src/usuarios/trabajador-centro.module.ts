import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrabajadorCentro } from './trabajador-centro.entity';
import { TrabajadorCentroService } from './trabajador-centro.service';
import { TrabajadorCentroController } from './trabajador-centro.controller';
import { Rol } from './rol.entity';
import { RolService } from './rol.service';
import { RolController } from './rol.controller';
import { Especialidad } from './especialidad.entity';
import { EspecialidadService } from './especialidad.service';
import { EspecialidadController } from './especialidad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TrabajadorCentro, Rol, Especialidad])],
  providers: [TrabajadorCentroService, RolService, EspecialidadService],
  controllers: [TrabajadorCentroController, RolController, EspecialidadController],
  exports: [TrabajadorCentroService, RolService, EspecialidadService],
})
export class TrabajadorCentroModule {} 