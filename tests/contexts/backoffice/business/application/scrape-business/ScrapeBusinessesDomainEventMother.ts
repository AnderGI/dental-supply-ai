import ScrapeBusinessesDomainEvent from '../../../../../../src/apps/backoffice/backend/controllers/business/scrape-google-maps/ScrapeBusinessesDomainEvent';

export class ScrapeBusinessesDomainEventMother {
	static create(
		aggregateId: string,
		gmail: string,
		industry: string,
		city: string
	): ScrapeBusinessesDomainEvent {
		return ScrapeBusinessesDomainEvent.fromPrimitives({
			aggregateId,
			attributes: {
				gmail,
				industry,
				city
			}
		});
	}
}
