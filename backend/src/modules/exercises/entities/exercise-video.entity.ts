import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exercise } from './exercise.entity';

@Entity()
export class ExerciseVideo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    wgerId: number;

    @ManyToOne(() => Exercise, (e) => e.videos, { onDelete: 'CASCADE' })
    exercise: Exercise;

    @Column({ type: 'text' })
    url: string;
}
