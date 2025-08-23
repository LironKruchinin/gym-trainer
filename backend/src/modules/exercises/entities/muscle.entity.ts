import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Muscle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    wgerId: number;

    @Column({ length: 100 })
    name: string;

    @Column({ default: false })
    isFront: boolean;
}
