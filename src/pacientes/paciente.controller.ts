import { Controller, Post, Body, Get, Patch, Param, Query } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { CreatePacienteCompletoDto } from './dto/create-paciente-completo.dto';
import { UpdateEstadoPacienteDto } from './dto/update-estado-paciente.dto';

@Controller('backend_api/pacientes')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Post()
  create(@Body() dto: CreatePacienteDto) {
    return this.pacienteService.create(dto);
  }

  @Post('completo')
  createCompleto(@Body() dto: CreatePacienteCompletoDto) {
    return this.pacienteService.createCompleto(dto);
  }

  @Get()
  findAll(
    @Query('terapeutaId') terapeutaId?: string,
    @Query('numeroDocumento') numeroDocumento?: string,
    @Query('nombreCompleto') nombreCompleto?: string,
    @Query('distritoId') distritoId?: string,
    @Query('estadoId') estadoId?: string,
    @Query('servicioId') servicioId?: string,
  ) {
    const parsedFilters = {
      terapeutaId: terapeutaId && !isNaN(Number(terapeutaId)) ? parseInt(terapeutaId, 10) : undefined,
      numeroDocumento: numeroDocumento,
      nombre: nombreCompleto,
      distritoId: distritoId && !isNaN(Number(distritoId)) ? parseInt(distritoId, 10) : undefined,
      estadoId: estadoId && !isNaN(Number(estadoId)) ? parseInt(estadoId, 10) : undefined,
      servicioId: servicioId && !isNaN(Number(servicioId)) ? parseInt(servicioId, 10) : undefined,
    };
    
    return this.pacienteService.findAll(parsedFilters);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePacienteDto) {
    return this.pacienteService.update(+id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pacienteService.findOneById(+id);
  }

  @Get('check-documento/:numeroDocumento')
  checkDocumentoExists(@Param('numeroDocumento') numeroDocumento: string) {
    return this.pacienteService.checkDocumentoExists(numeroDocumento);
  }

  @Patch(':id/estado')
  updateEstado(@Param('id') id: string, @Body() dto: UpdateEstadoPacienteDto) {
    return this.pacienteService.updateEstado(+id, dto);
  }

  @Patch(':id/visibilidad')
  controlarVisibilidad(
    @Param('id') id: string, 
    @Body() dto: { mostrarEnListado: boolean; userId: number }
  ) {
    return this.pacienteService.controlarVisibilidad(+id, dto.mostrarEnListado, dto.userId);
  }
}