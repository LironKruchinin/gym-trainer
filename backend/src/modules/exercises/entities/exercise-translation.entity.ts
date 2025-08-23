import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Exercise } from './exercise.entity';

@Entity()
export class ExerciseTranslation {
    @PrimaryGeneratedColumn()
    id: number;

    @Index('idx_translation_wger_id')
    @Column({ unique: true, nullable: true })
    wgerId: number;

    @ManyToOne(() => Exercise, (e) => e.translations, { onDelete: 'CASCADE' })
    exercise: Exercise;

    @Index('idx_translation_language')
    @Column()
    language: number;

    @Column({ length: 200 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;
}
