import RegisterClientCommand from '../../../../../src/contexts/backoffice/clients/application/register/RegisterClientCommand';
import Client from '../../../../../src/contexts/backoffice/clients/domain/Client';

export class ClientMother {
	static fromCommand(_: RegisterClientCommand): Client {
		const { data } = _;

		return Client.fromPrimitives({
			id: data.id,
			name: data.name,
			email: data.email,
			phone: data.phone,
			company: data.company,
			position: data.position
		});
	}
}
