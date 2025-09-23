import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PacienteServicioService } from './paciente-servicio.service';
import { CreatePacienteServicioDto } from './dto/create-paciente-servicio.dto';
import { AsignarServicioTerapeutaDto } from './dto/asignar-servicio-terapeuta.dto';

@Controller('backend_api/paciente-servicio')
export class PacienteServicioController {
  constructor(private readonly pacienteServicioService: PacienteServicioService) {}

  @Post()
  create(@Body() createPacienteServicioDto: CreatePacienteServicioDto) {
    return this.pacienteServicioService.create(createPacienteServicioDto);
  }

  @Get()
  findAll() {
    return this.pacienteServicioService.findAll();
  }

  @Get('paciente/:id')
  findByPaciente(@Param('id') id: string) {
    return this.pacienteServicioService.findByPaciente(+id);
  }

  @Get('servicio/:id')
  findByServicio(@Param('id') id: string) {
    return this.pacienteServicioService.findByServicio(+id);
  }

  @Get('paciente/:id/servicios-con-terapeuta')
  getServiciosConTerapeuta(@Param('id') id: string) {
    return this.pacienteServicioService.getServiciosConTerapeutaActual(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pacienteServicioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePacienteServicioDto: Partial<CreatePacienteServicioDto>) {
    return this.pacienteServicioService.update(+id, updatePacienteServicioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacienteServicioService.remove(+id);
  }

  @Post('asignar')
  asignarServicioYTerapeuta(@Body() dto: AsignarServicioTerapeutaDto) {
    return this.pacienteServicioService.asignarServicioYTerapeuta(dto);
  }

  @Delete('paciente/:pacienteId/servicio/:servicioId')
  desasignarServicio(
    @Param('pacienteId') pacienteId: string,
    @Param('servicioId') servicioId: string
  ) {
    return this.pacienteServicioService.desasignarServicio(+pacienteId, +servicioId);
  }

  @Delete('desasignar/:id')
  desasignarServicioPorId(@Param('id') id: string) {
    return this.pacienteServicioService.desasignarServicioPorId(+id);
  }
} 