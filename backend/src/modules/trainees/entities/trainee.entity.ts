import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TrainingProgram } from '../../training-programs/entities/training-program.entity';

@Entity('trainees')
export class Trainee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'timestamp' })
  reservedTime: Date;

  @ManyToOne(() => TrainingProgram, { nullable: true, eager: true })
  program?: TrainingProgram | null;
}
