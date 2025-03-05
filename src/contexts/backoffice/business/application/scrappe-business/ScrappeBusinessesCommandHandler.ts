import ScrapeBusinessesDomainEvent from '../../../../../apps/backoffice/backend/controllers/business/scrape-google-maps/ScrapeBusinessesDomainEvent';
import logger from '../../../../../shared/infrastructure/winston/config';
import { DomainEventClass } from '../../../../shared/domain/event/DomainEvent';
import { DomainEventSubscriber } from '../../../../shared/domain/event/DomainEventSubscriber';
import Business from '../../domain/Business';
import BusinessScrapper from '../../domain/BusinessScrapper';

export default class ScrappeBusinessesCommandHandler
	implements DomainEventSubscriber<ScrapeBusinessesDomainEvent>
{
	constructor(private readonly scrapper: BusinessScrapper) {}
	subscribedTo(): DomainEventClass[] {
		return [ScrapeBusinessesDomainEvent];
	}

	async on(_: ScrapeBusinessesDomainEvent): Promise<void> {
		logger.info('GetSpotifyUserLastTracksOnSpotifyUserLoggedIn#run');
		console.log(_);
		const business = new Business(_.gmail, _.industry, _.city);
		this.scrapper.scrape(business);

		return Promise.resolve();
	}

	queueName(): string {
		return 'andergi.backoffice.business.scrappe_businesses';
	}
}
