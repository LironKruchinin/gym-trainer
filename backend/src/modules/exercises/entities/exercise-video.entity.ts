import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Exercise } from './exercise.entity';

@Entity()
export class ExerciseVideo {
    @PrimaryGeneratedColumn()
    id: number;

    @Index('idx_video_wger_id')
    @Column({ unique: true })
    wgerId: number;

    @ManyToOne(() => Exercise, (e) => e.videos, { onDelete: 'CASCADE' })
    exercise: Exercise;

    @Column({ type: 'text' })
    url: string;
}
