import Business from './Business';

export default interface BusinessScrapper {
	scrape(_: Business): Promise<void>;
}
