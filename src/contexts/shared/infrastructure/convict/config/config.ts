import convict from 'convict';
import { configDotenv } from 'dotenv';
import path from 'path';

configDotenv({ path: path.join(__dirname, '..', '..', '..', '..', '..', '..', '.env') });

// Define a schema
const config = convict({
	env: {
		doc: 'The application environment.',
		format: ['production', 'dev', 'test'],
		env: 'NODE_ENV',
		default: 'dev'
	},
	typeorm: {
		host: {
			doc: 'The database host',
			format: String,
			env: 'TYPEORM_HOST',
			default: 'localhost'
		},
		port: {
			doc: 'The database port',
			format: Number,
			env: 'TYPEORM_PORT',
			default: 5433
		},
		username: {
			doc: 'The database username',
			format: String,
			env: 'TYPEORM_USERNAME',
			default: 'admin'
		},
		password: {
			doc: 'The database password',
			format: String,
			env: 'TYPEORM_PASSWORD',
			default: 'p@ssw0rd'
		},
		database: {
			doc: 'The database name',
			format: String,
			env: 'TYPEORM_DATABASE',
			default: 'backoffice-backend-dev'
		}
	},
	rabbitmq: {
		connectionSettings: {
			protocol: {
				doc: 'RabbitMQ communication protocol',
				format: String,
				env: 'RABBITMQ_PROTOCOL',
				default: 'amqp'
			},
			hostname: {
				doc: 'RabbitMQ hostname',
				format: String,
				env: 'RABBITMQ_HOSTNAME',
				default: 'localhost'
			},
			port: {
				doc: 'RabbitMQ communication port',
				format: Number,
				env: 'RABBITMQ_PORT',
				default: '5672'
			},
			username: {
				doc: 'RabbitMQ username',
				format: String,
				env: 'RABBITMQ_USERNAME',
				default: 'admin'
			},
			password: {
				doc: 'RabbitMQ password',
				format: String,
				env: 'RABBITMQ_PASSWORD',
				default: 'p@ssw0rd'
			},
			vhost: {
				doc: 'RabbitMQ vhost',
				format: String,
				env: 'RABBITMQ_VHOST',
				default: '/'
			}
		},
		publishOptions: {
			contentType: {
				doc: 'Content type for published messages',
				format: String,
				env: 'RABBITMQ_PUBLISH_CONTENT_TYPE',
				default: 'application/json'
			},
			contentEncoding: {
				doc: 'Content encoding for published messages',
				format: String,
				env: 'RABBITMQ_PUBLISH_CONTENT_ENCODING',
				default: 'utf-8'
			}
		}
	}
});

// Load environment-dependent configuration
const env = config.get('env');

config.loadFile(path.join(__dirname, '/', `convict_${env}.json`));

export default config;
