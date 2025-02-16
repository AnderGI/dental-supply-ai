import { EventBus } from '../../../../shared/domain/event/EventBus';
import Client from '../../domain/Client';
import ClientRepository from '../../domain/ClientRepository';
import RegisterClientCommand from './RegisterClientCommand';

export default class ClientRegistrar {
	constructor(private readonly repository: ClientRepository, private readonly eventBus: EventBus) {}
	async registar(command: RegisterClientCommand): Promise<void> {
		await Client.save(command)(this.repository, this.eventBus);
	}
}
