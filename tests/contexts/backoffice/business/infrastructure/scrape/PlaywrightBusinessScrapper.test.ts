import Business from '../../../../../../src/contexts/backoffice/business/domain/Business';
import PlaywrightBusinessScrapper from '../../../../../../src/contexts/backoffice/business/infrastructure/PlaywrightBusinessScrapper';

describe('PlaywrightBusinessScrapper', () => {
	describe('#scrape', () => {
		it('should scrape data', async () => {
			const _ = new PlaywrightBusinessScrapper();
			await _.scrape(new Business('agibarguen@gmail.com', 'clinicas dentales', 'getxo'));
		});
	});
});
