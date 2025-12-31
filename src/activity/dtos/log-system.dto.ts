import { IsIn, IsOptional, IsString } from 'class-validator';
import { EntityType } from '../domain/entities';

export class LogSystemDto {
  @IsIn(['lead', 'contact', 'account', 'deal'])
  entityType: EntityType;

  @IsString()
  entityId: string;

  @IsString()
  event: string;

  @IsOptional()
  @IsString()
  message?: string;
}
