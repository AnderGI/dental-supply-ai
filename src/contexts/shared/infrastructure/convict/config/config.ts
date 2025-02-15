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
		default: process.env.NODE_ENV
	},
	typeorm: {
		host: {
			doc: 'The database host',
			format: String,
			env: 'TYPEORM_HOST',
			default: process.env.TYPEORM_HOST
		},
		port: {
			doc: 'The database port',
			format: Number,
			env: 'TYPEORM_PORT',
			default: process.env.TYPEORM_PORT
		},
		username: {
			doc: 'The database username',
			format: String,
			env: 'TYPEORM_USERNAME',
			default: process.env.TYPEORM_USERNAME
		},
		password: {
			doc: 'The database password',
			format: String,
			env: 'TYPEORM_PASSWORD',
			default: process.env.TYPEORM_PASSWORD
		},
		database: {
			doc: 'The database name',
			format: String,
			env: 'TYPEORM_DATABASE',
			default: process.env.TYPEORM_DATABASE
		}
	},
	rabbitmq: {
		connectionSettings: {
			protocol: {
				doc: 'RabbitMQ communication protocol',
				format: String,
				env: 'RABBITMQ_PROTOCOL',
				default: process.env.RABBITMQ_PROTOCOL
			},
			hostname: {
				doc: 'RabbitMQ hostname',
				format: String,
				env: 'RABBITMQ_HOSTNAME',
				default: process.env.RABBITMQ_HOSTNAME
			},
			port: {
				doc: 'RabbitMQ communication port',
				format: Number,
				env: 'RABBITMQ_PORT',
				default: process.env.RABBITMQ_PORT
			},
			username: {
				doc: 'RabbitMQ username',
				format: String,
				env: 'RABBITMQ_USERNAME',
				default: process.env.RABBITMQ_USERNAME
			},
			password: {
				doc: 'RabbitMQ password',
				format: String,
				env: 'RABBITMQ_PASSWORD',
				default: process.env.RABBITMQ_PASSWORD
			},
			vhost: {
				doc: 'RabbitMQ vhost',
				format: String,
				env: 'RABBITMQ_VHOST',
				default: process.env.RABBITMQ_VHOST
			}
		},
		publishOptions: {
			contentType: {
				doc: 'Content type for published messages',
				format: String,
				env: 'RABBITMQ_PUBLISH_CONTENT_TYPE',
				default: process.env.RABBITMQ_PUBLISH_CONTENT_TYPE
			},
			contentEncoding: {
				doc: 'Content encoding for published messages',
				format: String,
				env: 'RABBITMQ_PUBLISH_CONTENT_ENCODING',
				default: process.env.RABBITMQ_PUBLISH_CONTENT_ENCODING
			}
		}
	}
});

// Load environment-dependent configuration
const env = config.get('env') as string;

config.loadFile(path.join(__dirname, '/', `convict_${env}.json`));

export default config;
