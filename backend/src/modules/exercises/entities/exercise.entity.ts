import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ExerciseTranslation } from './exercise-translation.entity';
import { ExerciseVideo } from './exercise-video.entity';

export type ExerciseCategory =
    | 'cardio'
    | 'strength'
    | 'olympic'
    | 'gymnastics'
    | 'accessory';

@Entity({ name: 'exercises' })
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: true })
    wgerId?: number;

    @Column({ type: 'varchar', length: 200 })
    name: string;

    @Column({ type: 'varchar', length: 50 })
    category: ExerciseCategory;

    @Column({ type: 'varchar', length: 200, nullable: true })
    equipment?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    // stores as comma‑separated in a single text column
    @Column({ type: 'simple-array', nullable: true })
    scalingOptions?: string[];

    @OneToMany(() => ExerciseTranslation, (t) => t.exercise)
    translations?: ExerciseTranslation[];

    @OneToMany(() => ExerciseVideo, (v) => v.exercise)
    videos?: ExerciseVideo[];
}
