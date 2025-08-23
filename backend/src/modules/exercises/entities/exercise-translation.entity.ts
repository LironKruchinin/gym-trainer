import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exercise } from './exercise.entity';

@Entity()
export class ExerciseTranslation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Exercise, (e) => e.translations, { onDelete: 'CASCADE' })
    exercise: Exercise;

    @Column()
    language: number;

    @Column({ length: 200 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;
}
