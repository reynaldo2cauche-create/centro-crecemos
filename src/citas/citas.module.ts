import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './cita.entity';
import { HistorialCita } from './historial-cita.entity';
import { CitaService } from './cita.service';
import { CitaController } from './cita.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cita, HistorialCita])],
  providers: [CitaService],
  controllers: [CitaController],
  exports: [CitaService]
})
export class CitasModule {}
