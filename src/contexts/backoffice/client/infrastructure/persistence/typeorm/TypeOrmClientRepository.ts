import { DataSource, EntitySchema, Repository } from 'typeorm';

import { Nullable } from '../../../../../../shared/domain/Nullable';
import Client from '../../../domain/Client';
import ClientRepository from '../../../domain/ClientRepository';
import { ClientEntity } from './ClientEntity.entity';

export class TypeOrmClientRepository implements ClientRepository {
	constructor(private readonly _client: Promise<DataSource>) {}

	public async save(client: Client): Promise<void> {
		return this.persist(client);
	}

	public async search(_: Client): Promise<Nullable<Client>> {
		const repository = await this.repository();
		const retrievedUser = await repository.findOne({
			where: {
				id: _.id.value
			}
		});

		return retrievedUser;
	}

	public entitySchema(): EntitySchema<Client> {
		return ClientEntity;
	}

	private async client(): Promise<DataSource> {
		return this._client;
	}

	private async repository(): Promise<Repository<Client>> {
		return (await this.client()).getRepository(this.entitySchema());
	}

	private async persist(aggregateRoot: Client): Promise<void> {
		const repository = await this.repository();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await repository.save(aggregateRoot);
	}
}
