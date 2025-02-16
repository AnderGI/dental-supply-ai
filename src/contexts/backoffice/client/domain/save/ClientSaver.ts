import { EventBus } from '../../../../shared/domain/event/EventBus';
import ClientRegisteredDomainEvent from '../../application/register/ClientRegisteredDomainEvent';
import RegisterClientCommand from '../../application/register/RegisterClientCommand';
import Client from '../Client';
import ClientRepository from '../ClientRepository';

export default class ClientSaver {
	static async save(
		command: RegisterClientCommand,
		repository: ClientRepository,
		eventBus: EventBus
	): Promise<void> {
		const { data } = command;
		const client = Client.create({
			id: data.id,
			name: data.name,
			email: data.email,
			phone: data.phone,
			company: data.company,
			position: data.position
		});
		const event = ClientRegisteredDomainEvent.fromPrimitives({
			aggregateId: client.id.value,
			attributes: {
				company: client.company.value,
				email: client.email.value,
				name: client.name.value,
				phone: client.phone.value,
				position: client.position.value
			}
		});
		await repository.save(client);
		await eventBus.publish(event);
	}
}
