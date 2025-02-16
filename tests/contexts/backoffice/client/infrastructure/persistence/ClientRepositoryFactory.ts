import container from '../../../../../../src/apps/backoffice/backend/dependency-injection';
import ClientRepository from '../../../../../../src/contexts/backoffice/client/domain/ClientRepository';

export default class ClientRepositoryFactory {
	public static getRepository(): ClientRepository {
		return container.get('backoffice.client.ClientRepository');
	}
}
