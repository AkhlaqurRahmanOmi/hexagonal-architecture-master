import { IsString, MinLength, IsUUID } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsUUID()
  ownerUserId: string;
}
