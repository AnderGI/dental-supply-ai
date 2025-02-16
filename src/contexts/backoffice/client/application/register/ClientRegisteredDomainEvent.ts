import { DomainEvent } from '../../../../shared/domain/event/DomainEvent';

type ClientRegisteredDomainEventAttributes = {
	readonly name: string;
	readonly email: string;
	readonly phone: string;
	readonly company: string;
	readonly position: string;
};

export default class ClientRegisteredDomainEvent extends DomainEvent {
	static readonly EVENT_NAME: string = 'andergi.backoffice.client.event.client_registered.1';
	readonly name: string;
	readonly email: string;
	readonly phone: string;
	readonly company: string;
	readonly position: string;

	constructor({
		aggregateId,
		name,
		email,
		phone,
		company,
		position,
		eventId,
		occurredOn
	}: {
		aggregateId: string;
		name: string;
		email: string;
		phone: string;
		company: string;
		position: string;
		eventId?: string;
		occurredOn?: Date;
	}) {
		super({
			eventName: ClientRegisteredDomainEvent.EVENT_NAME,
			aggregateId,
			eventId,
			occurredOn
		});
		this.name = name;
		this.email = email;
		this.phone = phone;
		this.company = company;
		this.position = position;
	}

	static fromPrimitives(params: {
		aggregateId: string;
		attributes: ClientRegisteredDomainEventAttributes;
		eventId?: string;
		occurredOn?: Date;
	}): ClientRegisteredDomainEvent {
		const { aggregateId, attributes, occurredOn, eventId } = params;

		return new ClientRegisteredDomainEvent({
			aggregateId,
			name: attributes.name,
			email: attributes.email,
			phone: attributes.phone,
			company: attributes.company,
			position: attributes.position,
			eventId,
			occurredOn
		});
	}

	toPrimitives(): ClientRegisteredDomainEventAttributes {
		const { name, email, phone, company, position } = this;

		return { name, email, phone, company, position };
	}

	fromReceivedData(data: {
		eventName: string;
		aggregateId: string;
		eventId: string;
		occurredOn: string;
		attributes: any;
	}): DomainEvent {
		return ClientRegisteredDomainEvent.fromPrimitives({
			aggregateId: data.aggregateId,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			attributes: data.attributes,
			eventId: data.eventId,
			occurredOn: new Date(this.occurredOn)
		});
	}

	getEventName(): string {
		return 'andergi.backoffice.client.event.client_registered.1';
	}
}
