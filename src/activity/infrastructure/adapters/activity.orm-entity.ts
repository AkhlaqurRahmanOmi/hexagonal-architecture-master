import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('activity_timeline')
@Index(['tenantId', 'entityType', 'entityId'])
export class ActivityEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'actor_user_id', type: 'uuid', nullable: true })
  actorUserId?: string | null;

  @Column({ name: 'entity_type', type: 'varchar', length: 20 })
  entityType: string;

  @Column({ name: 'entity_id', type: 'uuid' })
  entityId: string;

  @Column({ type: 'varchar', length: 30 })
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
