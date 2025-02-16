import ClientRegistrar from '../../../../../../src/contexts/backoffice/client/application/register/ClientRegistrar';
import RegisterClientCommandHandler from '../../../../../../src/contexts/backoffice/client/application/register/RegisterClientCommandHandler';
import { ClientMother } from '../../domain/ClientMother';
import MockClientRepository from '../../domain/MockClientRepository';
import { RegisterClientCommandMother } from './RegisterClientCommandMother';

describe('ClientRegistrar', () => {
	describe('#register', () => {
		it('Should register a non existing client', async () => {
			const command = RegisterClientCommandMother.random();
			const repository = new MockClientRepository();
			const client = ClientMother.fromCommand(command);
			const registar = new ClientRegistrar(repository);
			const handler = new RegisterClientCommandHandler(registar);

			await handler.handle(command);

			repository.ensureSaveHasBeenCalledWith(client);
		});
	});
});
