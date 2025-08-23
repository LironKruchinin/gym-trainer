import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export interface ProgramExercise {
    name: string;
    sets: number;
    reps: string;
    weight: string;
    notes?: string;
}

@Entity()
export class TrainingProgram {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'varchar', length: 20 })
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';

    // stored as JSONB
    @Column({ type: 'jsonb', nullable: true })
    exercises?: ProgramExercise[];

    @Column({ length: 100 })
    workoutType: string;

    @Column({ length: 50, nullable: true })
    timeCap?: string;

    @Column({ default: true })
    isTemplate: boolean;
}
