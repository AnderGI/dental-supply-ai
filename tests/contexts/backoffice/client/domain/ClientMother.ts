import * as fs from 'faker';

import RegisterClientCommand from '../../../../../src/contexts/backoffice/client/application/register/RegisterClientCommand';
import Client from '../../../../../src/contexts/backoffice/client/domain/Client';

export class ClientMother {
	static create(): Client {
		const primitives = {
			id: fs.datatype.uuid(),
			name: fs.name.firstName(),
			email: fs.internet.email(),
			phone: fs.phone.phoneNumber(),
			company: fs.company.companyName(),
			position: fs.name.jobType()
		};

		return Client.fromPrimitives(primitives);
	}

	static fromCommand(_: RegisterClientCommand): Client {
		const { data } = _;
		const primitives = {
			id: data.id,
			name: data.name,
			email: data.email,
			phone: data.phone,
			company: data.company,
			position: data.position
		};

		return Client.fromPrimitives(primitives);
	}
}
