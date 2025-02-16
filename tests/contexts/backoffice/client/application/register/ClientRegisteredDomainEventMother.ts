import ClientRegisteredDomainEvent from '../../../../../../src/contexts/backoffice/client/application/register/ClientRegisteredDomainEvent';
import Client from '../../../../../../src/contexts/backoffice/client/domain/Client';

export class ClientRegisteredDomainEventMother {
	static fromAggregate(_: Client): ClientRegisteredDomainEvent {
		return ClientRegisteredDomainEvent.fromPrimitives({
			aggregateId: _.id.value,
			attributes: {
				company: _.company.value,
				email: _.email.value,
				name: _.name.value,
				phone: _.phone.value,
				position: _.position.value
			}
		});
	}
}
