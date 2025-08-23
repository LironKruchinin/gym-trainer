import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { TrainingProgramsModule } from './modules/training-programs/training-programs.module';
import { TraineesModule } from './modules/trainees/trainees.module';
import { TrainingLogsModule } from './modules/training-logs/training-logs.module';

@Module({
	imports: [
		AppConfigModule,
		DatabaseModule,
                CommonModule,
                UsersModule,
                AuthModule,
                SessionsModule,
                TrainingProgramsModule,
                TraineesModule,
                TrainingLogsModule,
        ],
	controllers: [],
	providers: [],
})
export class AppModule { }
