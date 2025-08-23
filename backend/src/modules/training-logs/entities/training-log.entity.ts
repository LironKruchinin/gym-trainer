import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Trainee } from '../../trainees/entities/trainee.entity';
import { TrainingProgram } from '../../training-programs/entities/training-program.entity';

@Entity('training_logs')
export class TrainingLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Trainee, { eager: true })
  trainee: Trainee;

  @ManyToOne(() => TrainingProgram, { eager: true })
  program: TrainingProgram;

    @Column({ type: 'jsonb', nullable: true })
    details?: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamp' })
  completedAt: Date;
}
