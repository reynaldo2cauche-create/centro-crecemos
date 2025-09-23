import { Controller, Get, Post, Body, Patch, Param, Put } from '@nestjs/common';
import { TrabajadorCentroService } from './trabajador-centro.service';
import { CreateTrabajadorCentroDto } from './dto/create-trabajador-centro.dto';
import { UpdateTrabajadorCentroDto } from './dto/update-trabajador-centro.dto';

@Controller('backend_api/trabajadores')
export class TrabajadorCentroController {
  constructor(private readonly service: TrabajadorCentroService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOneById(+id);
  }

  @Post()
  create(@Body() dto: CreateTrabajadorCentroDto) {
    console.log('Body recibido en controller:', dto);
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrabajadorCentroDto) {
    return this.service.update(+id, dto);
  }

  @Put(':id/activar')
  activar(@Param('id') id: string) {
    return this.service.setEstado(+id, true);
  }

  @Put(':id/desactivar')
  desactivar(@Param('id') id: string) {
    return this.service.setEstado(+id, false);
  }
} 