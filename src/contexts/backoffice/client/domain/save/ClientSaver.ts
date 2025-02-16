import RegisterClientCommand from '../../application/register/RegisterClientCommand';
import Client from '../Client';
import ClientRepository from '../ClientRepository';

export default class ClientSaver {
	static async save(command: RegisterClientCommand, repository: ClientRepository): Promise<void> {
		const { data } = command;
		const client = Client.create({
			id: data.id,
			name: data.name,
			email: data.email,
			phone: data.phone,
			company: data.company,
			position: data.position
		});
		await repository.save(client);
	}
}
