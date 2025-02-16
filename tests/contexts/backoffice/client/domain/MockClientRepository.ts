import Client from '../../../../../src/contexts/backoffice/client/domain/Client';
import ClientRepository from '../../../../../src/contexts/backoffice/client/domain/ClientRepository';

export default class MockClientRepository implements ClientRepository {
	private readonly mockSave: jest.Mock;
	constructor() {
		this.mockSave = jest.fn();
	}

	async save(_: Client): Promise<void> {
		this.mockSave(_);

		return Promise.resolve();
	}

	ensureSaveHasBeenCalledWith(client: Client): void {
		expect(this.mockSave).toHaveBeenCalledWith(client);
	}
}
