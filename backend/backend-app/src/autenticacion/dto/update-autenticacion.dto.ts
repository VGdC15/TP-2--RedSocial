import { PartialType } from '@nestjs/mapped-types';
import { CreateAutenticacionDto } from './create-autenticacion.dto';

export class UpdateAutenticacionDto extends PartialType(CreateAutenticacionDto) {}
