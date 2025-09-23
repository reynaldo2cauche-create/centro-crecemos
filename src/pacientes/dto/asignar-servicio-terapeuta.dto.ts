import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class AsignarServicioTerapeutaDto {
  @IsNumber()
  paciente_id: number;

  @IsNumber()
  servicio_id: number;

  @IsOptional()
  @IsNumber()
  terapeuta_id?: number; // Opcional

  @IsOptional()
  @IsDateString()
  fecha_inicio?: Date;
} 