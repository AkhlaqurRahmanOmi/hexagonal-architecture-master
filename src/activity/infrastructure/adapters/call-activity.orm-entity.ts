import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('call_activities')
export class CallActivityEntity {
  @PrimaryColumn('uuid', { name: 'activity_id' })
  activityId: string;

  @Column({ type: 'varchar', length: 20 })
  direction: 'inbound' | 'outbound';

  @Column({ name: 'duration_seconds', type: 'int', nullable: true })
  durationSeconds?: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  summary?: string | null;
}
