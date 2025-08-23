// src/auth/entities/blacklisted-token.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blacklisted_tokens')
export class BlacklistedToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', unique: true })
    token: string;

    @Column({ type: 'timestamp' })
    expires_at: Date;

    @Column({ type: 'timestamp', default: () => 'now()' })
    created_at: Date;
}
