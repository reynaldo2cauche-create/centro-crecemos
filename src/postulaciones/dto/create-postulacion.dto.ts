import { IsString, IsEmail, IsOptional, IsNotEmpty, MaxLength, IsEnum } from 'class-validator';

export class CreatePostulacionDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  @MaxLength(100)
  apellido: string;

  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El formato del email no es válido' })
  @MaxLength(150)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  telefono?: string;

  @IsNotEmpty({ message: 'El cargo postulado es obligatorio' })
  @IsString()
  @MaxLength(50)
  cargo_postulado: string;

  @IsOptional()
  @IsString()
  experiencia?: string;
}