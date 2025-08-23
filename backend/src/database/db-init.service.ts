import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DbInitService implements OnModuleInit {
	private readonly logger = new Logger(DbInitService.name);

	// define your tables + creation SQL here
	private readonly tableDefinitions: Record<string, string> = {
		users: `
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(255) UNIQUE,
        phone_num VARCHAR(20) UNIQUE,
        password VARCHAR(255),
        auth_provider VARCHAR(20) NOT NULL DEFAULT 'phone',
        provider_id VARCHAR(255),
        profile_image TEXT,
        subscription_status VARCHAR(20) NOT NULL DEFAULT 'free',
        accepted_tos_at TIMESTAMP DEFAULT now(),
        marketing_opt_in BOOLEAN DEFAULT false,
        push_notifications BOOLEAN DEFAULT true,
        email_notifications BOOLEAN DEFAULT true,
        email_verified_at TIMESTAMP,
        phone_verified_at TIMESTAMP,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `,
		notifications: `
      CREATE TABLE notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        scheduled_at TIMESTAMP NOT NULL,
        sent_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT now()
      );
      CREATE INDEX idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX idx_notifications_scheduled_at ON notifications(scheduled_at);
    `,
		tags: `
      CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        color VARCHAR(20) DEFAULT '#000000',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `,
		otp_codes: `
      CREATE TABLE otp_codes (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) NOT NULL,
        code VARCHAR(10) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT now()
      );
      CREATE INDEX idx_otp_phone ON otp_codes(phone);
    `,
		rate_limit_logs: `
      CREATE TABLE rate_limit_logs (
        id SERIAL PRIMARY KEY,
        ip_address TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        method TEXT NOT NULL,
        user_agent TEXT,
        status VARCHAR(10) NOT NULL,
        count INTEGER NOT NULL,
        max INTEGER NOT NULL,
        window_ms INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
      CREATE INDEX idx_rate_limit_logs_ip ON rate_limit_logs(ip_address);
      CREATE INDEX idx_rate_limit_logs_endpoint ON rate_limit_logs(endpoint);
    `,
		jwt_blacklist: `
      CREATE TABLE jwt_blacklist (
        id SERIAL PRIMARY KEY,
        token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
    `,
		roles: `
      CREATE TABLE roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        type VARCHAR(50) NOT NULL DEFAULT 'subscription',
        description TEXT,
        created_at TIMESTAMP DEFAULT now()
      );
      INSERT INTO roles (name, type, description)
      VALUES
        ('guest',   'subscription', 'Temporary guest users'),
        ('basic',   'subscription', 'Free tier with limited items'),
        ('premium', 'subscription', 'Unlimited items and files');
    `,
		user_roles: `
      CREATE TABLE user_roles (
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT now(),
        PRIMARY KEY (user_id, role_id)
      );
      CREATE INDEX idx_user_roles_user ON user_roles(user_id);
      CREATE INDEX idx_user_roles_role ON user_roles(role_id);
    `,
		exercise_categories: `
      CREATE TABLE exercise_categories (
        id SERIAL PRIMARY KEY,
        wger_id INTEGER UNIQUE NOT NULL,
        name VARCHAR(100),
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `,
		muscles: `
      CREATE TABLE muscles (
        id SERIAL PRIMARY KEY,
        wger_id INTEGER UNIQUE NOT NULL,
        name VARCHAR(100),
        is_front BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `,
		equipment: `
      CREATE TABLE equipment (
        id SERIAL PRIMARY KEY,
        wger_id INTEGER UNIQUE NOT NULL,
        name VARCHAR(100),
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `,
		exercises: `
      CREATE TABLE exercises (
        id SERIAL PRIMARY KEY,
        wger_id INTEGER UNIQUE NOT NULL,
        name VARCHAR(200),
        description TEXT,
        category_id INTEGER REFERENCES exercise_categories(id),
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `,
                exercise_translations: `
      CREATE TABLE exercise_translations (
        id SERIAL PRIMARY KEY,
        exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
        language INTEGER NOT NULL,
        name VARCHAR(200) NOT NULL,
        description TEXT
      );
      CREATE INDEX idx_exercise_translations_ex ON exercise_translations(exercise_id);
    `,
                exercise_info: `
      CREATE TABLE exercise_info (
        id SERIAL PRIMARY KEY,
        wger_id INTEGER UNIQUE NOT NULL,
        info JSONB
      );
    `,
                exercise_videos: `
      CREATE TABLE exercise_videos (
        id SERIAL PRIMARY KEY,
        wger_id INTEGER UNIQUE NOT NULL,
        exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `,
		exercise_muscles: `
      CREATE TABLE exercise_muscles (
        exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
        muscle_id INTEGER REFERENCES muscles(id) ON DELETE CASCADE,
        PRIMARY KEY (exercise_id, muscle_id)
      );
    `,
		exercise_equipment: `
      CREATE TABLE exercise_equipment (
        exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
        equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
        PRIMARY KEY (exercise_id, equipment_id)
      );
    `,
		workout_types: `
      CREATE TABLE workout_types (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `,
		training_programs: `
      CREATE TABLE training_programs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        difficulty_level VARCHAR(20) NOT NULL,
        exercises JSONB,
        workout_type VARCHAR(100) NOT NULL,
        time_cap VARCHAR(50),
        is_template BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `,
	};

	private readonly tables: { tbl_name: string; dependencies: string[] }[] = [
		{ tbl_name: 'users', dependencies: [] },
		{ tbl_name: 'tags', dependencies: [] },
		{ tbl_name: 'notifications', dependencies: ['users', 'items'] },
		{ tbl_name: 'otp_codes', dependencies: [] },
		{ tbl_name: 'rate_limit_logs', dependencies: [] },
		{ tbl_name: 'jwt_blacklist', dependencies: [] },
		{ tbl_name: 'roles', dependencies: [] },
		{ tbl_name: 'user_roles', dependencies: ['users', 'roles'] },
		{ tbl_name: 'exercise_categories', dependencies: [] },
		{ tbl_name: 'muscles', dependencies: [] },
		{ tbl_name: 'equipment', dependencies: [] },
                { tbl_name: 'exercises', dependencies: ['exercise_categories'] },
                { tbl_name: 'exercise_translations', dependencies: ['exercises'] },
                { tbl_name: 'exercise_info', dependencies: [] },
                { tbl_name: 'exercise_videos', dependencies: ['exercises'] },
                { tbl_name: 'exercise_muscles', dependencies: ['exercises', 'muscles'] },
                { tbl_name: 'exercise_equipment', dependencies: ['exercises', 'equipment'] },
                { tbl_name: 'workout_types', dependencies: [] },
                { tbl_name: 'training_programs', dependencies: [] },
        ];

	constructor(private dataSource: DataSource) { }

	private resolveCreationOrder(): string[] {
		const adj = new Map<string, string[]>();
		const indegree = new Map<string, number>();

		for (const { tbl_name } of this.tables) {
			indegree.set(tbl_name, 0);
			adj.set(tbl_name, []);
		}

		for (const { tbl_name, dependencies } of this.tables) {
			for (const dep of dependencies) {
				adj.get(dep)!.push(tbl_name);
				indegree.set(tbl_name, (indegree.get(tbl_name) || 0) + 1);
			}
		}

		const queue = [...indegree.entries()]
			.filter(([, v]) => v === 0)
			.map(([k]) => k);
		const order: string[] = [];

		while (queue.length) {
			const current = queue.shift()!;
			order.push(current);
			for (const neighbor of adj.get(current)!) {
				indegree.set(neighbor, indegree.get(neighbor)! - 1);
				if (indegree.get(neighbor) === 0) {
					queue.push(neighbor);
				}
			}
		}

		return order;
	}

	async onModuleInit() {
		const runner = this.dataSource.createQueryRunner();
		await runner.connect();

		const orderedTables = this.resolveCreationOrder();

		for (const tableName of orderedTables) {
			const exists = await runner.hasTable(tableName);
			if (exists) {
				this.logger.log(`✅ Table "${tableName}" already exists`);
				continue;
			}

			const createSql = this.tableDefinitions[tableName];
			if (!createSql) {
				this.logger.warn(`❌ No SQL found for table "${tableName}"`);
				continue;
			}

			this.logger.warn(`⚠️ Table "${tableName}" is missing—creating now`);
			try {
				await runner.query(createSql);
				this.logger.log(`🎉 Table "${tableName}" created`);
			} catch (err: any) {
				this.logger.error(`❌ Failed to create table "${tableName}": ${err.message}`);
			}
		}

		await runner.release();
	}
}
