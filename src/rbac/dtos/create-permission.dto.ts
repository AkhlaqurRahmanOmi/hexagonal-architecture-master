import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @MinLength(2)
  key: string;

  @IsOptional()
  @IsString()
  description?: string;
}
