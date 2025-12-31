import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('note_activities')
export class NoteActivityEntity {
  @PrimaryColumn('uuid', { name: 'activity_id' })
  activityId: string;

  @Column({ name: 'note_text', type: 'text' })
  text: string;
}
