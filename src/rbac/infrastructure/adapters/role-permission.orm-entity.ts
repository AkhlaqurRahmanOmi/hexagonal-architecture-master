import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { RoleEntity } from './role.orm-entity';
import { PermissionEntity } from './permission.orm-entity';

@Entity('role_permissions')
@Index(['roleId', 'permissionId'], { unique: true })
export class RolePermissionEntity {
  @PrimaryColumn('uuid', { name: 'role_id' })
  roleId: string;

  @PrimaryColumn('uuid', { name: 'permission_id' })
  permissionId: string;

  @ManyToOne(() => RoleEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;

  @Column({ name: 'assigned_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;
}
