// ============================================
// src/archivos/archivos-oficiales.controller.ts
// ============================================
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Res,
  ParseIntPipe,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ArchivosOficialesService } from './archivos-oficiales.service';
import { CrearArchivoOficialDto } from './dto/crear-archivo-oficial.dto';
import { ValidarDocumentoDto } from './dto/validar-documento.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Tu guard de autenticación

@Controller('backend_api/archivos-oficiales')
export class ArchivosOficialesController {
  constructor(private readonly archivosService: ArchivosOficialesService) {}

  // ============================================
  // SUBIR ARCHIVO OFICIAL
  // ============================================
  @Post('subir')
  // @UseGuards(JwtAuthGuard) // Descomenta cuando tengas autenticación
  @UseInterceptors(FileInterceptor('archivo', {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB máximo
    },
  }))
  async subirArchivo(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CrearArchivoOficialDto,
    @Req() req: any, // Obtener usuario del token JWT
  ) {
    // TODO: Obtener trabajadorId y rol del token JWT
    const trabajadorId = req.user?.id || 1; // TEMPORAL
    const rolTrabajador = req.user?.rol || 'admin'; // TEMPORAL

    if (!file) {
      return { error: 'Debe seleccionar un archivo' };
    }

    const archivo = await this.archivosService.subirArchivo(
      file,
      dto,
      trabajadorId,
      rolTrabajador,
    );

    return {
      success: true,
      message: 'Archivo subido correctamente',
      data: {
        id: archivo.id,
        codigoValidacion: archivo.codigoValidacion,
        nombreArchivo: archivo.nombreOriginal,
        fechaEmision: archivo.fechaEmision,
      },
    };
  }
    @Get('generar-codigo')
// @UseGuards(JwtAuthGuard)
async generarCodigoPreview(@Req() req: any) {
  const rolTrabajador = req.user?.rol || 'admin'; // TEMPORAL
  
  if (!['admin', 'admision'].includes(rolTrabajador.toLowerCase())) {
    throw new ForbiddenException('No tienes permisos');
  }

  const codigo = await this.archivosService.generarCodigoPreview();

  return {
    success: true,
    data: {
      codigo,
      mensaje: 'Código generado. Añádalo al documento antes de subirlo.',
    },
  };
}


  // ============================================
  // LISTAR ARCHIVOS
  // ============================================
  @Get()
  // @UseGuards(JwtAuthGuard)
  async listarArchivos(
    @Query('pacienteId') pacienteId: number,
    @Req() req: any,
  ) {
    const rolTrabajador = req.user?.rol || 'admin'; // TEMPORAL

    const archivos = await this.archivosService.listarArchivos(
      rolTrabajador,
      pacienteId,
    );

    return {
      success: true,
      data: archivos,
    };
  }

  // ============================================
  // VISUALIZAR/DESCARGAR ARCHIVO
  // ============================================
  @Get(':id/descargar')
  // @UseGuards(JwtAuthGuard)
  async descargarArchivo(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const trabajadorId = req.user?.id || 1; // TEMPORAL
    const rolTrabajador = req.user?.rol || 'admin'; // TEMPORAL

    const { buffer, mimetype, filename } = await this.archivosService.obtenerArchivo(
      id,
      trabajadorId,
      rolTrabajador,
    );

    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `inline; filename="${filename}"`, // inline para visualizar, attachment para descargar
    });

    res.send(buffer);
  }

  // ============================================
  // ELIMINAR ARCHIVO
  // ============================================
  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  async eliminarArchivo(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const trabajadorId = req.user?.id || 1; // TEMPORAL
    const rolTrabajador = req.user?.rol || 'admin'; // TEMPORAL

    await this.archivosService.eliminarArchivo(id, trabajadorId, rolTrabajador);

    return {
      success: true,
      message: 'Archivo eliminado correctamente',
    };
  }

  // ============================================
  // VALIDAR DOCUMENTO (PÚBLICO - SIN AUTH)
  // ============================================
  @Post('validar')
  async validarDocumento(@Body() dto: ValidarDocumentoDto) {
    const resultado = await this.archivosService.validarDocumento(dto.codigo);

    return {
      success: true,
      data: resultado,
    };
  }

  // Endpoint alternativo GET para validación directa
  @Get('validar/:codigo')
  async validarDocumentoPorUrl(@Param('codigo') codigo: string) {
    const resultado = await this.archivosService.validarDocumento(codigo);

    return {
      success: true,
      data: resultado,
    };
  }
}