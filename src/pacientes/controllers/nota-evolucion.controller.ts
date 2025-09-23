import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { NotaEvolucionService } from '../services/nota-evolucion.service';
import { CreateNotaEvolucionDto } from '../dto/create-nota-evolucion.dto';

@Controller('backend_api/nota-evolucion')
export class NotaEvolucionController {
  constructor(private readonly service: NotaEvolucionService) {}

  @Post()
  create(@Body() dto: CreateNotaEvolucionDto) {
    return this.service.create(dto);
  }

  @Get('paciente/:id')
  findByPaciente(
    @Param('id') id: string,
    @Query('trabajador_id') trabajador_id?: string
  ) {
    const trabajadorIdNumber = trabajador_id ? parseInt(trabajador_id, 10) : undefined;
    return this.service.findByPaciente(+id, trabajadorIdNumber);
  }

  
} 