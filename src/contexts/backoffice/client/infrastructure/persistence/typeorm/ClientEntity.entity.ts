import { EntitySchema } from 'typeorm';

import { ValueObjectTransformer } from '../../../../../shared/infrastructure/persistence/typeorm/ValueObjectTransformer';
import Client from '../../../domain/Client';
import ClientCompany from '../../../domain/ClientCompany';
import ClientEmail from '../../../domain/ClientEmail';
import ClientId from '../../../domain/ClientId';
import ClientName from '../../../domain/ClientName';
import ClientPhone from '../../../domain/ClientPhone';
import ClientPosition from '../../../domain/ClientPosition';

export const ClientEntity = new EntitySchema<Client>({
	name: 'Client',
	tableName: 'clients',
	target: Client,
	columns: {
		id: {
			type: String,
			primary: true,
			transformer: ValueObjectTransformer(ClientId)
		},
		name: {
			type: String,
			transformer: ValueObjectTransformer(ClientName)
		},
		email: {
			type: String,
			transformer: ValueObjectTransformer(ClientEmail)
		},
		phone: {
			type: String,
			transformer: ValueObjectTransformer(ClientPhone)
		},
		company: {
			type: String,
			transformer: ValueObjectTransformer(ClientCompany)
		},
		position: {
			type: String,
			transformer: ValueObjectTransformer(ClientPosition)
		}
	}
});
