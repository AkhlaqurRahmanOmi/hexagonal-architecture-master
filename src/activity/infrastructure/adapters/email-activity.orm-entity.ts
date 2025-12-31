import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('email_activities')
export class EmailActivityEntity {
  @PrimaryColumn('uuid', { name: 'activity_id' })
  activityId: string;

  @Column({ name: 'to_email', type: 'varchar', length: 255, nullable: true })
  toEmail?: string | null;

  @Column({ name: 'from_email', type: 'varchar', length: 255, nullable: true })
  fromEmail?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject?: string | null;

  @Column({ name: 'body_preview', type: 'varchar', length: 255, nullable: true })
  bodyPreview?: string | null;
}
