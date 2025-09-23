import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistoriaClinicaService } from './historia-clinica.service';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';

@Controller('historia-clinica')
export class HistoriaClinicaController {
  constructor(private readonly historiaClinicaService: HistoriaClinicaService) {}

  @Post()
  create(@Body() createHistoriaClinicaDto: CreateHistoriaClinicaDto) {
    return this.historiaClinicaService.create(createHistoriaClinicaDto);
  }

  @Get()
  findAll() {
    return this.historiaClinicaService.findAll();
  }

  @Get('paciente-servicio/:id')
  findByPacienteServicio(@Param('id') id: string) {
    return this.historiaClinicaService.findByPacienteServicio(+id);
  }

  @Get('terapeuta/:id')
  findByTerapeuta(@Param('id') id: string) {
    return this.historiaClinicaService.findByTerapeuta(+id);
  }

  @Get('paciente/:id')
  findByPaciente(@Param('id') id: string) {
    return this.historiaClinicaService.findByPaciente(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historiaClinicaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistoriaClinicaDto: Partial<CreateHistoriaClinicaDto>) {
    return this.historiaClinicaService.update(+id, updateHistoriaClinicaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historiaClinicaService.remove(+id);
  }
} 