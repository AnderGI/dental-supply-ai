import ClientRegistrar from '../../../../../../src/contexts/backoffice/client/application/register/ClientRegistrar';
import RegisterClientCommandHandler from '../../../../../../src/contexts/backoffice/client/application/register/RegisterClientCommandHandler';
import { ClientMother } from '../../domain/ClientMother';
import MockClientEventBus from '../../domain/MockClientEventBus';
import MockClientRepository from '../../domain/MockClientRepository';
import { ClientRegisteredDomainEventMother } from './ClientRegisteredDomainEventMother';
import { RegisterClientCommandMother } from './RegisterClientCommandMother';

describe('ClientRegistrar', () => {
	describe('#register', () => {
		it('Should register a non existing client', async () => {
			const command = RegisterClientCommandMother.random();
			const repository = new MockClientRepository();
			const eventBus = new MockClientEventBus();
			const client = ClientMother.fromCommand(command);
			const event = ClientRegisteredDomainEventMother.fromAggregate(client);
			const registar = new ClientRegistrar(repository, eventBus);
			const handler = new RegisterClientCommandHandler(registar);

			await handler.handle(command);

			repository.ensureSaveHasBeenCalledWith(client);
			eventBus.assertBusHasBeenCalledWith(event);
		});
	});
});
