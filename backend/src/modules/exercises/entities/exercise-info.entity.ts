import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExerciseInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    wgerId: number;

    @Column({ type: 'jsonb' })
    info: any;
}
