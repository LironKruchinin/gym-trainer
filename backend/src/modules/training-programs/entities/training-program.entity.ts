import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export interface ProgramExercise {
    name: string;
    sets: number;
    reps: string;
    weight: string;
    rest?: string;
}

@Entity('training_programs')
export class TrainingProgram {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', length: 200 })
    name: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description?: string;

    @Column({ name: 'difficulty_level', type: 'varchar', length: 20 })
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';

    // stored as JSONB
    @Column({ name: 'exercises', type: 'jsonb', nullable: true })
    exercises?: ProgramExercise[];

    @Column({ name: 'workout_type', length: 100 })
    workoutType: string;

    @Column({ name: 'time_cap', length: 50, nullable: true })
    timeCap?: string;

    @Column({ name: 'is_template', default: true })
    isTemplate: boolean;
}
