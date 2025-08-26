import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TrainingProgram } from '../../training-programs/entities/training-program.entity';

@Entity('training_times')
export class TrainingTime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'bigint',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  training_time: number;

  @ManyToOne(() => TrainingProgram, { eager: true, nullable: true, onDelete: 'SET NULL' })
  program?: TrainingProgram | null;

  @Column({ type: 'jsonb', nullable: true })
  details?: Record<string, unknown>;
}
