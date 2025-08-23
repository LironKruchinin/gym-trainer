// config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import configuration from './configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema: Joi.object({
                DB_URL: Joi.string()
                    .uri({ scheme: ['postgres', 'postgresql'] }) // ✅ accept only pg schemes
                    .required(),
                DB_SSL: Joi.boolean().default(false),
                PORT: Joi.number().default(3001),
            }),
        }),
    ],
})
export class AppConfigModule { }
