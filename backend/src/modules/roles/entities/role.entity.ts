import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    name: string;

    @Column({ length: 50, default: 'subscription' })
    type: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}
