import { IsString, IsNumber, IsOptional, IsEmail } from 'class-validator';

export class CreateTrabajadorCentroDto {
  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsString()
  dni: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsNumber()
  rol_id: number;

  @IsOptional()
  @IsString()
  cargo?: string;

  @IsOptional()
  @IsNumber()
  institucion_id?: number;

  @IsOptional()
  @IsNumber()
  especialidad_id?: number;
} 