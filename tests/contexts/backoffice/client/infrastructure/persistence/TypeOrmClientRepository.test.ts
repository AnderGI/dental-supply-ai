import EnvironmentArrengerFactory from '../../../../shared/infrastructure/arranger/EnvironmentArrengerFactory';
import ClientRepositoryArrenger from './ClientRepositoryArrenger';
import ClientRepositoryFactory from './ClientRepositoryFactory';

describe('TypeOrmClientRepository', () => {
	describe('#save', () => {
		it('should upsert a client', async () => {
			const arrenger = new ClientRepositoryArrenger(
				ClientRepositoryFactory.getRepository(),
				EnvironmentArrengerFactory.getArranger()
			);
			await arrenger.saveClient();
		});
	});
});
