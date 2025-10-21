// ============================================
// src/archivos/archivos-oficiales.service.ts
// ============================================
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArchivoOficial } from './entities/archivo-oficial.entity';
import { CrearArchivoOficialDto } from './dto/crear-archivo-oficial.dto';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArchivosOficialesService {
  private readonly uploadPath = './uploads/archivos-oficiales';

  constructor(
    @InjectRepository(ArchivoOficial)
    private archivoOficialRepo: Repository<ArchivoOficial>,
  ) {
    this.createUploadDirectory();
  }

  private async createUploadDirectory() {
    try {
      await fs.mkdir(this.uploadPath, { recursive: true });
    } catch (error) {
      console.error('Error creando directorio:', error);
    }
  }

  // ============================================
  // GENERAR CÓDIGO CTC ALFANUMÉRICO
  // ============================================
  private generarCodigoCTC(): string {
    const caracteres = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let codigo = '';
    
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres[randomIndex];
    }
    
    return `CTC-${codigo}`;
  }

  private async generarCodigoUnico(): Promise<string> {
    let codigo: string;
    let existe: boolean;

    do {
      codigo = this.generarCodigoCTC();
      const encontrado = await this.archivoOficialRepo.findOne({
        where: { codigoValidacion: codigo }
      });
      existe = !!encontrado;
    } while (existe);

    return codigo;
  }

  async generarCodigoPreview(): Promise<string> {
    return await this.generarCodigoUnico();
  }

  // ============================================
  // ✅ FUNCIÓN AUXILIAR: Convertir string YYYY-MM-DD a Date sin zona horaria
  // ============================================
  private parseLocalDate(dateString: string): Date {
    // Recibe: '2025-10-21'
    // Retorna: Date en medianoche LOCAL (no UTC)
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // month - 1 porque en JS los meses van de 0-11
  }

  // ============================================
  // SUBIR ARCHIVO OFICIAL
  // ============================================
  async subirArchivo(
    file: Express.Multer.File,
    dto: CrearArchivoOficialDto,
    trabajadorId: number,
    rolTrabajador: string,
  ): Promise<ArchivoOficial> {
    // Validar que solo admin o admisión puedan subir
    if (!['admin', 'admision'].includes(rolTrabajador.toLowerCase())) {
      throw new ForbiddenException('Solo admin y admisión pueden subir archivos oficiales');
    }

    // Validar tipo de archivo
    const tiposPermitidos = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/jpeg',
      'image/png',
    ];

    if (!tiposPermitidos.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de archivo no permitido. Solo PDF, Word, JPG, PNG');
    }

    // Generar nombre único para el archivo
    const extension = path.extname(file.originalname);
    const nombreArchivo = `${uuidv4()}${extension}`;
    const rutaCompleta = path.join(this.uploadPath, nombreArchivo);

    // Guardar archivo en disco
    await fs.writeFile(rutaCompleta, file.buffer);

    // ============================================
    // DECIDIR QUÉ CÓDIGO USAR
    // ============================================
    let codigoValidacion: string;
    
    if (dto.codigoManual) {
      // Si el admin proporcionó un código manual (generado previamente)
      
      // Validar formato CTC-XXXXXXXX
      if (!/^CTC-[0-9A-Z]{8}$/.test(dto.codigoManual)) {
        await fs.unlink(rutaCompleta); // Eliminar archivo subido
        throw new BadRequestException('El código debe tener el formato CTC-XXXXXXXX');
      }
      
      // Validar que el código no exista ya en la BD
      const existe = await this.archivoOficialRepo.findOne({
        where: { codigoValidacion: dto.codigoManual }
      });
      
      if (existe) {
        await fs.unlink(rutaCompleta); // Eliminar archivo subido
        throw new BadRequestException('El código ingresado ya existe en el sistema');
      }
      
      codigoValidacion = dto.codigoManual;
    } else {
      // Si NO hay código manual, generar uno automáticamente
      codigoValidacion = await this.generarCodigoUnico();
    }

    // ============================================
    // ✅ CONVERSIÓN CORRECTA DE FECHAS SIN ZONA HORARIA
    // ============================================
    const archivo = this.archivoOficialRepo.create({
      pacienteId: dto.pacienteId,
      terapeutaId: dto.terapeutaId,
      trabajadorSubioId: trabajadorId,
      tipoArchivoId: dto.tipoArchivoId,
      nombreArchivo,
      nombreOriginal: file.originalname,
      tipoMime: file.mimetype,
      tamano: file.size,
      rutaArchivo: rutaCompleta,
      descripcion: dto.descripcion,
      codigoValidacion,
      fechaEmision: this.parseLocalDate(dto.fechaEmision),
      fechaVigencia: dto.fechaVigencia ? this.parseLocalDate(dto.fechaVigencia) : null,
    });

    return await this.archivoOficialRepo.save(archivo);
  }

  // ============================================
  // LISTAR ARCHIVOS (Solo admin y admisión)
  // ============================================
  async listarArchivos(
    rolTrabajador: string,
    pacienteId?: number,
  ): Promise<ArchivoOficial[]> {
    if (!['admin', 'admision'].includes(rolTrabajador.toLowerCase())) {
      throw new ForbiddenException('No tienes permisos para ver archivos oficiales');
    }

    const query = this.archivoOficialRepo
      .createQueryBuilder('archivo')
      .leftJoinAndSelect('archivo.paciente', 'paciente')
      .leftJoinAndSelect('archivo.terapeuta', 'terapeuta')
      .leftJoinAndSelect('archivo.trabajadorSubio', 'trabajadorSubio')
      .leftJoinAndSelect('archivo.tipoArchivo', 'tipoArchivo')
      .where('archivo.activo = :activo', { activo: 1 });

    if (pacienteId) {
      query.andWhere('archivo.pacienteId = :pacienteId', { pacienteId });
    }

    return await query.orderBy('archivo.fechaCreacion', 'DESC').getMany();
  }

  // ============================================
  // VISUALIZAR/DESCARGAR ARCHIVO
  // ============================================
  async obtenerArchivo(
    id: number,
    trabajadorId: number,
    rolTrabajador: string,
  ): Promise<{ buffer: Buffer; mimetype: string; filename: string }> {
    // Solo admin y admisión pueden ver archivos oficiales
    if (!['admin', 'admision'].includes(rolTrabajador.toLowerCase())) {
      throw new ForbiddenException('No tienes permisos');
    }

    const archivo = await this.archivoOficialRepo.findOne({
      where: { id, activo: 1 },
    });

    if (!archivo) {
      throw new NotFoundException('Archivo no encontrado');
    }

    // Leer archivo del disco
    const buffer = await fs.readFile(archivo.rutaArchivo);

    return {
      buffer,
      mimetype: archivo.tipoMime,
      filename: archivo.nombreOriginal,
    };
  }

  // ============================================
  // ELIMINAR ARCHIVO (Soft delete)
  // ============================================
  async eliminarArchivo(
    id: number,
    trabajadorId: number,
    rolTrabajador: string,
  ): Promise<void> {
    if (!['admin', 'admision'].includes(rolTrabajador.toLowerCase())) {
      throw new ForbiddenException('No tienes permisos');
    }

    const archivo = await this.archivoOficialRepo.findOne({
      where: { id, activo: 1 },
    });

    if (!archivo) {
      throw new NotFoundException('Archivo no encontrado');
    }

    // Soft delete
    archivo.activo = 0;
    await this.archivoOficialRepo.save(archivo);

    // Opcional: eliminar archivo físico
    // await fs.unlink(archivo.rutaArchivo);
  }

  // ============================================
  // VALIDAR DOCUMENTO (WEB PÚBLICA)
  // ============================================
 // ============================================
// ACTUALIZACIÓN EN archivos-oficiales.service.ts
// ============================================

// Reemplaza el método validarDocumento() con esta versión corregida:

// En archivos-oficiales.service.ts
async validarDocumento(codigoValidacion: string) {
  const archivo = await this.archivoOficialRepo.findOne({
    where: { codigoValidacion },
    relations: ['paciente', 'paciente.estado', 'terapeuta', 'tipoArchivo'],
  });

  if (!archivo) {
    throw new NotFoundException('Documento no encontrado');
  }

 

  // Función para ocultar DNI
  const ocultarDNI = (dni: string): string => {
    if (!dni || dni.length < 4) return '****';
    return '*'.repeat(dni.length - 4) + dni.slice(-4);
  };

  // ✅ SOLUCIÓN CORREGIDA
  const formatearFechaSinZonaHoraria = (fecha: Date | string): string => {
    if (!fecha) return null;
    
    let fechaObj: Date;
    
    if (typeof fecha === 'string') {
      if (fecha.includes('T')) {
        // Formato ISO: "2025-10-21T00:00:00.000Z"
        fechaObj = new Date(fecha);
      } else {
        // Formato simple: "2025-10-21"
        const [year, month, day] = fecha.split('-').map(Number);
        fechaObj = new Date(year, month - 1, day);
      }
    } else if (fecha instanceof Date) {
      fechaObj = fecha;
    } else {
      return null;
    }
    
    if (isNaN(fechaObj.getTime())) return null;
    
    const year = fechaObj.getFullYear();
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const day = String(fechaObj.getDate()).padStart(2, '0');
    
    const resultado = `${year}-${month}-${day}`;
 
    
    return resultado;
  };

  // ✅ FUNCIÓN CORREGIDA PARA VALIDAR VIGENCIA
  const estaVigente = (fechaVigencia: Date | string): boolean => {
    if (!fechaVigencia) {
  
      return true; // Si no hay fecha de vigencia, siempre es válido
    }
    
    let fechaVigenciaObj: Date;
    
    // Parsear fecha de vigencia
    if (typeof fechaVigencia === 'string') {
      if (fechaVigencia.includes('T')) {
        fechaVigenciaObj = new Date(fechaVigencia);
      } else {
        const [year, month, day] = fechaVigencia.split('-').map(Number);
        // Configurar a las 23:59:59 del día de vigencia
        fechaVigenciaObj = new Date(year, month - 1, day, 23, 59, 59, 999);
      }
    } else if (fechaVigencia instanceof Date) {
      // Si ya es Date, ajustar a fin del día
      fechaVigenciaObj = new Date(fechaVigencia);
      fechaVigenciaObj.setHours(23, 59, 59, 999);
    } else {
      console.log('❌ Fecha de vigencia inválida');
      return false;
    }
    
    const ahora = new Date();
    const vigente = fechaVigenciaObj > ahora;
    

    return vigente;
  };

  const fechaEmisionFormateada = formatearFechaSinZonaHoraria(archivo.fechaEmision);
  const fechaVigenciaFormateada = archivo.fechaVigencia 
    ? formatearFechaSinZonaHoraria(archivo.fechaVigencia) 
    : null;
  const vigente = estaVigente(archivo.fechaVigencia);

  return {
    valido: true,
    codigo: archivo.codigoValidacion,
    tipoDocumento: archivo.tipoArchivo?.nombre || 'Sin especificar',
    paciente: {
      nombres: archivo.paciente.nombres,
      apellidos: `${archivo.paciente.apellido_paterno} ${archivo.paciente.apellido_materno}`,
      dni: ocultarDNI(archivo.paciente.numero_documento),
      activo: archivo.paciente.activo,
      estado: archivo.paciente.estado?.nombre || null,
    },
    terapeuta: {
      nombres: archivo.terapeuta.nombres,
      apellidos: archivo.terapeuta.apellidos,
    },
    fechaEmision: fechaEmisionFormateada,
    fechaVigencia: fechaVigenciaFormateada,
    vigente: vigente,
    urlVerificacion: `${process.env.FRONTEND_URL || 'https://www.crecemos.com.pe'}/validar?code=${archivo.codigoValidacion}`,
  };
}
}