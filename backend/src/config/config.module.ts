// config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import configuration from './configuration';

@Module({
    imports: [
        // config.module.ts
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema: Joi.object({
                DB_URL: Joi.string().uri().required(),
                DB_SSL: Joi.boolean().default(false),
            }),
        })
    ],
})
export class AppConfigModule { }
