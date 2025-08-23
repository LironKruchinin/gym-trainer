import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type ExerciseCategory =
    | 'cardio'
    | 'strength'
    | 'olympic'
    | 'gymnastics'
    | 'accessory';

@Entity()
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

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
}
