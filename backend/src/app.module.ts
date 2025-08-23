import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './modules/sessions/sessions.module';

@Module({
	imports: [
		AppConfigModule,
		DatabaseModule,
                CommonModule,
                UsersModule,
                AuthModule,
                SessionsModule,
        ],
	controllers: [],
	providers: [],
})
export class AppModule { }
