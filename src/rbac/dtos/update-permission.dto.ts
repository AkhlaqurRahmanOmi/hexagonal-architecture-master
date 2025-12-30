import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  key?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
