import { IsIn } from 'class-validator';
import { MembershipRole } from '../domain/entities';

export class UpdateTenantMemberRoleDto {
  @IsIn(['admin', 'member'])
  role: MembershipRole;
}
