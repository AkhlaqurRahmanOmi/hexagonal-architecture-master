import { IsString, MinLength } from 'class-validator';

export class AddTenantDomainDto {
  @IsString()
  @MinLength(3)
  domain: string;
}
