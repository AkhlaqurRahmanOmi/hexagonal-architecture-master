import { IsIn, IsString } from 'class-validator';
import { EntityType } from '../domain/entities';

export class LogNoteDto {
  @IsIn(['lead', 'contact', 'account', 'deal'])
  entityType: EntityType;

  @IsString()
  entityId: string;

  @IsString()
  text: string;
}
