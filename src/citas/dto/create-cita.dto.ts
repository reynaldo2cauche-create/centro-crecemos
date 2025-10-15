import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString, Matches } from 'class-validator';

export class CreateCitaDto {
  @IsNotEmpty()
  @IsNumber()
  paciente_id: number;

  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  @IsNotEmpty()
  @IsNumber()
  servicio_id: number;

  @IsNotEmpty()
  @IsNumber()
  motivo_id: number;

  @IsNotEmpty()
  @IsNumber()
  estado_id: number;

  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, { message: 'hora_inicio debe tener formato HH:MM:SS' })
  hora_inicio: string;

  @IsNotEmpty()
  @IsNumber()
  duracion_minutos: number;

  @IsOptional()
  @IsString()
  nota?: string;

  @IsOptional()
  @IsNumber()
  user_id?: number;
}
