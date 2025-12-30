import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_role_assignments')
@Index(['tenantId', 'userId', 'roleId'], { unique: true })
export class UserRoleAssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'role_id', type: 'uuid' })
  roleId: string;

  @Column({ name: 'assigned_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;
}
