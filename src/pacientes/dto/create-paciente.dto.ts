import { IsString, IsOptional, IsNumber } from 'class-validator';
import { CreateParejaDto } from './create-pareja.dto';

export class CreatePacienteDto {
  recaptchaToken: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento: Date;
  tipo_documento_id: number;
  numero_documento: string;
  sexo_id: number;
  distrito_id: number;
  direccion?: string;
  @IsOptional()
  @IsNumber()
  servicio_id?: number;
  motivo_consulta?: string;
  referido_por?: string;
  responsable_nombre?: string;
  responsable_apellido_paterno?: string;
  responsable_apellido_materno?: string;
  responsable_tipo_documento_id?: number;
  responsable_numero_documento?: string;
  responsable_relacion_id?: number;
  responsable_telefono?: string;
  responsable_email?: string;
  diagnostico_medico?: string;
  alergias?: string;
  medicamentos_actuales?: string;
  acepta_terminos?: boolean;
  acepta_info_comercial?: boolean;
  @IsOptional()
  estado_paciente_id?: number;
  @IsNumber()
  user_id: number;

  // Datos de la pareja (opcional, solo para Terapia de Pareja)
  @IsOptional()
  pareja?: CreateParejaDto;
}