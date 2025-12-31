import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('system_activities')
export class SystemActivityEntity {
  @PrimaryColumn('uuid', { name: 'activity_id' })
  activityId: string;

  @Column({ type: 'varchar', length: 50 })
  event: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  message?: string | null;
}
