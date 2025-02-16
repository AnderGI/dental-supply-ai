import { DomainEventClass } from '../../../../shared/domain/event/DomainEvent';
import { DomainEventSubscriber } from '../../../../shared/domain/event/DomainEventSubscriber';
import ClientRegisteredDomainEvent from '../../../client/application/register/ClientRegisteredDomainEvent';

export default class CreateClientInsightsOnClientUpdated
	implements DomainEventSubscriber<ClientRegisteredDomainEvent>
{
	subscribedTo(): DomainEventClass[] {
		return [ClientRegisteredDomainEvent];
	}

	async on(domainEvent: ClientRegisteredDomainEvent): Promise<void> {
		console.log(domainEvent);

		return Promise.resolve();
	}

	queueName(): string {
		return 'agi.client-insights.create-client-insights-on-client-updated';
	}
}
