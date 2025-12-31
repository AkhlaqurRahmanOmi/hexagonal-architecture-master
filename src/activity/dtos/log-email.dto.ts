import { IsEmail, IsOptional, IsString, IsIn } from 'class-validator';
import { EntityType } from '../domain/entities';

export class LogEmailDto {
  @IsIn(['lead', 'contact', 'account', 'deal'])
  entityType: EntityType;

  @IsString()
  entityId: string;

  @IsOptional()
  @IsEmail()
  toEmail?: string;

  @IsOptional()
  @IsEmail()
  fromEmail?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  bodyPreview?: string;
}
