import { IsOptional, IsString, IsISO8601, IsIn } from 'class-validator';
import { EntityType } from '../domain/entities';

export class LogMeetingDto {
  @IsIn(['lead', 'contact', 'account', 'deal'])
  entityType: EntityType;

  @IsString()
  entityId: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsISO8601()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  summary?: string;
}
