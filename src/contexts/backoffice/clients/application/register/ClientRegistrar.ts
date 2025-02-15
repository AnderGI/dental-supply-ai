import Client from '../../domain/Client';
import ClientRepository from '../../domain/ClientRepository';
import RegisterClientCommand from './RegisterClientCommand';

export default class ClientRegistrar {
	constructor(private readonly repository: ClientRepository) {}
	async registar(command: RegisterClientCommand): Promise<void> {
		await Client.save(command)(this.repository);
	}
}
