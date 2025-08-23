import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../config/config.module';
import { DbInitService } from './db-init.service';

@Module({
    imports: [
        AppConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [ConfigService],
            useFactory: (cs: ConfigService) => {
                const db = cs.getOrThrow<{ url: string; ssl: boolean }>('database');
                return {
                    type: 'postgres',
                    url: db.url,
                    ssl: db.ssl ? { rejectUnauthorized: false } : false,
                    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                    synchronize: true,                 // you’re creating tables by hand
                    logging: ['error', 'warn', 'schema', 'query'], // <- see what’s happening
                };
            },
        }),
    ],
    providers: [DbInitService],
})
export class DatabaseModule { }
