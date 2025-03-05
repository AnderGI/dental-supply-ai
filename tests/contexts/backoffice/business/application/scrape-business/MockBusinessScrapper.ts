import Business from '../../../../../../src/contexts/backoffice/business/domain/Business';
import BusinessScrapper from '../../../../../../src/contexts/backoffice/business/domain/BusinessScrapper';

export default class MockBusinessScrapper implements BusinessScrapper {
	private readonly scrapeMock: jest.Mock;
	constructor() {
		this.scrapeMock = jest.fn();
	}

	async scrape(_: Business): Promise<void> {
		this.scrapeMock(_);

		return Promise.resolve();
	}

	public expectScrapeHasBennCalledWith(_: Business): void {
		expect(this.scrapeMock).toHaveBeenCalledWith(_);
	}
}
