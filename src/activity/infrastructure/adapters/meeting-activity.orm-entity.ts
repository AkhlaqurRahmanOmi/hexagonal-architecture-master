import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('meeting_activities')
export class MeetingActivityEntity {
  @PrimaryColumn('uuid', { name: 'activity_id' })
  activityId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string | null;

  @Column({ name: 'scheduled_at', type: 'timestamp', nullable: true })
  scheduledAt?: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  summary?: string | null;
}
