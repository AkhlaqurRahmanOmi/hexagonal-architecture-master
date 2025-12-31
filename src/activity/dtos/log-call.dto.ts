import { IsIn, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { EntityType } from '../domain/entities';

export class LogCallDto {
  @IsIn(['lead', 'contact', 'account', 'deal'])
  entityType: EntityType;

  @IsString()
  entityId: string;

  @IsIn(['inbound', 'outbound'])
  direction: 'inbound' | 'outbound';

  @IsOptional()
  @IsInt()
  @Min(1)
  durationSeconds?: number;

  @IsOptional()
  @IsString()
  summary?: string;
}
