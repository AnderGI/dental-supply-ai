import { DataSource } from 'typeorm';

import { TypeOrmConfig } from './TypeOrmConfig';

export class TypeOrmClientFactory {
	static async createClient(contextName: string, config: TypeOrmConfig): Promise<DataSource> {
		const connection = new DataSource({
			name: contextName,
			type: 'postgres',
			host: config.host,
			port: config.port,
			username: config.username,
			password: config.password,
			database: config.database,
			entities: [`${__dirname}/../../../../**/*.entity.ts`],
			synchronize: true,
			logging: true
		});
		try {
			return connection.initialize();
		} catch (error) {
			console.log(`Error in TypeOrm factory`);
			process.exit(1);
		}
	}
}
