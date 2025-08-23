// src/modules/users/entities/user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    first_name?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    recovery_code: string | null;

    @Column({ length: 100, nullable: true })
    last_name?: string;

    @Column({ length: 255, unique: true, nullable: true })
    email?: string;

    @Column({ length: 20, nullable: true })
    phone_num?: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ length: 20, default: 'phone' })
    auth_provider: string;

    @Column({ length: 255, nullable: true })
    provider_id?: string;

    @Column({ type: 'text', nullable: true })
    profile_image?: string;

    @Column({ length: 20, default: 'basic' })
    subscription_status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    accepted_tos_at: Date;

    @Column({ default: false })
    marketing_opt_in: boolean;

    @Column({ default: true })
    push_notifications: boolean;

    @Column({ default: true })
    email_notifications: boolean;

    @Column({ type: 'timestamp', nullable: true })
    email_verified_at?: Date;

    @Column({ type: 'timestamp', nullable: true })
    phone_verified_at?: Date;

    @Column({ type: 'timestamp', nullable: true })
    last_login?: Date;

    @Column({ default: true })
    is_active: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @ManyToMany(() => Role, (role) => role.users, { eager: true })
    @JoinTable({
        name: 'user_roles',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    })
    roles: Role[];
}
