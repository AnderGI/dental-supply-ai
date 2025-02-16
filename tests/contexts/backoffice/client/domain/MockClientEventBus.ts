import ClientRegisteredDomainEvent from '../../../../../src/contexts/backoffice/client/application/register/ClientRegisteredDomainEvent';
import MockEventBus from '../../../shared/__mocks__/MockEventBus';

export default class MockClientEventBus extends MockEventBus<ClientRegisteredDomainEvent> {
	assertBusHasBeenCalledWith(_: ClientRegisteredDomainEvent): void {
		const calls = this.publishMock.mock.calls;
		expect(calls.length).toBeGreaterThan(0);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const publishedDomainEvent = calls[0][0] as unknown as ClientRegisteredDomainEvent;
		expect(_.toPrimitives()).toMatchObject(publishedDomainEvent.toPrimitives());
	}
}
