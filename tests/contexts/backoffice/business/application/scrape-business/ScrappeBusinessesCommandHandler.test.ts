import ScrappeBusinessesCommandHandler from '../../../../../../src/contexts/backoffice/business/application/scrappe-business/ScrappeBusinessesCommandHandler';
import Business from '../../../../../../src/contexts/backoffice/business/domain/Business';
import MockBusinessScrapper from './MockBusinessScrapper';
import { ScrapeBusinessesDomainEventMother } from './ScrapeBusinessesDomainEventMother';

describe('ScrappeBusinessesCommandHandler', () => {
	describe('#on', () => {
		it('should correctly call the scraper', async () => {
			const scrapper = new MockBusinessScrapper();
			const handler = new ScrappeBusinessesCommandHandler(scrapper);
			const event = ScrapeBusinessesDomainEventMother.create(
				'johndoe@gmail.com',
				'johndoe@gmail.com',
				'Clinicas dnetales',
				'Getxo'
			);

			await handler.on(event);

			scrapper.expectScrapeHasBennCalledWith(
				new Business('johndoe@gmail.com', 'Clinicas dnetales', 'Getxo')
			);
		});
	});
});
