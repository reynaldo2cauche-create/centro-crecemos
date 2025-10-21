// ============================================
// src/dto/crear-archivo-oficial.dto.ts
// ============================================
import { IsInt, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearArchivoOficialDto {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty({ message: 'El pacienteId es requerido' })
  pacienteId: number;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty({ message: 'El terapeutaId es requerido' })
  terapeutaId: number;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty({ message: 'El tipoArchivoId es requerido' })
  tipoArchivoId: number;

  @IsDateString({}, { message: 'La fechaEmision debe ser una fecha válida (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'La fechaEmision es requerida' })
  fechaEmision: string;

  @IsDateString({}, { message: 'La fechaVigencia debe ser una fecha válida (YYYY-MM-DD)' })
  @IsOptional()
  fechaVigencia?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  codigoManual?: string;
}