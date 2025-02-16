import ClientRepository from '../../../../../../src/contexts/backoffice/client/domain/ClientRepository';
import { EnvironmentArranger } from '../../../../shared/infrastructure/arranger/EnvironmentArranger';
import { ClientMother } from '../../domain/ClientMother';

export default class ClientRepositoryArrenger {
	constructor(
		private readonly repository: ClientRepository,
		private readonly environmentArranger: EnvironmentArranger
	) {}

	public async saveClient(): Promise<void> {
		await this.cleanFirst();
		const client = ClientMother.create();
		await this.repository.save(client);
		await this.cleanEnd();
	}

	private async cleanFirst(): Promise<void> {
		await this.environmentArranger.clean();
	}

	private async cleanEnd(): Promise<void> {
		await this.environmentArranger.clean();
		await this.environmentArranger.close();
	}
}
