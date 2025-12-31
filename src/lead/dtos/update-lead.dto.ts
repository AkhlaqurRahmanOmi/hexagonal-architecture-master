import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { LeadStatus } from '../domain/entities';

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsIn(['new', 'contacted', 'qualified', 'unqualified'])
  status?: LeadStatus;

  @IsOptional()
  @IsString()
  source?: string;
}
