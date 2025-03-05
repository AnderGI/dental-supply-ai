import { DomainEvent } from '../../../../../../contexts/shared/domain/event/DomainEvent';

type ScrapeBusinessesDomainEventAttributes = {
	readonly gmail: string;
	readonly city: string;
	readonly industry: string;
};
export default class ScrapeBusinessesDomainEvent extends DomainEvent {
	static readonly EVENT_NAME: string = 'andergi.backoffice.business.command.scrape-businesses.1';

	readonly gmail: string;
	readonly city: string;
	readonly industry: string;
	constructor({
		aggregateId,
		gmail,
		city,
		industry,
		eventId,
		occurredOn
	}: {
		aggregateId: string;
		gmail: string;
		city: string;
		industry: string;
		eventId?: string;
		occurredOn?: Date;
	}) {
		super({
			eventName: ScrapeBusinessesDomainEvent.EVENT_NAME,
			aggregateId,
			eventId,
			occurredOn
		});
		this.gmail = gmail;
		this.city = city;
		this.industry = industry;
	}

	static fromPrimitives(params: {
		aggregateId: string;
		attributes: ScrapeBusinessesDomainEventAttributes;
		eventId?: string;
		occurredOn?: Date;
	}): ScrapeBusinessesDomainEvent {
		const { aggregateId, attributes, occurredOn, eventId } = params;

		return new ScrapeBusinessesDomainEvent({
			aggregateId,
			gmail: attributes.gmail,
			city: attributes.city,
			industry: attributes.industry,
			eventId,
			occurredOn
		});
	}

	toPrimitives(): ScrapeBusinessesDomainEventAttributes {
		const { gmail, city, industry } = this;

		return {
			gmail,
			city,
			industry
		};
	}

	fromReceivedData(data: {
		eventName: string;
		aggregateId: string;
		eventId: string;
		occurredOn: string;
		attributes: any;
	}): DomainEvent {
		return ScrapeBusinessesDomainEvent.fromPrimitives({
			aggregateId: data.aggregateId,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			attributes: data.attributes,
			eventId: data.eventId,
			occurredOn: new Date(this.occurredOn)
		});
	}

	getEventName(): string {
		return ScrapeBusinessesDomainEvent.EVENT_NAME;
	}
}
