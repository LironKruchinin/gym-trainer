// main.ts
// import './global.polyfill'; 

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { join } from 'path';

async function bootstrap() {
	const uploadPath = path.join(__dirname, '..', 'uploads/private');
	if (!fs.existsSync(uploadPath)) {
		fs.mkdirSync(uploadPath, { recursive: true });
	}
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.useGlobalFilters(new GlobalExceptionFilter());

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	// Enable security headers
	app.use(helmet());

	// Enable gzip compression
	app.use(compression());

	// Global validation pipe (DTOs)
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,    // strip any props not in your DTO
			transform: true,    // turn payloads into DTO instances
			forbidNonWhitelisted: true,
		}),
	);

	// Enable CORS
	app.enableCors({
		origin: ['http://localhost:3000', 'http://localhost:8081'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	});

	// Don't serve ./uploads/private
	app.useStaticAssets(join(__dirname, '..', 'uploads/public'), {
		prefix: '/public',
	});


	await app.listen(3001);
}
bootstrap();
