import { IsIn, IsUUID } from 'class-validator';
import { MembershipRole } from '../domain/entities';

export class AddTenantMemberDto {
  @IsUUID()
  userId: string;

  @IsIn(['admin', 'member'])
  role: MembershipRole;
}
