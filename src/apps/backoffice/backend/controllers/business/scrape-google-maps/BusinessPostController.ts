import { Response } from 'express';
import httpStatus from 'http-status';

import { EventBus } from '../../../../../../contexts/shared/domain/event/EventBus';
import { Controller } from '../../../../../../shared/domain/Controller';
import BusinessPostRequest from './BusinessPostRequest';
import ScrapeBusinessCommand from './ScrapeBusinessCommand';
import ScrapeBusinessesDomainEvent from './ScrapeBusinessesDomainEvent';

export default class BusinessPostController implements Controller<BusinessPostRequest> {
	constructor(private readonly eventBus: EventBus) {}
	run(req: BusinessPostRequest, res: Response): void {
		const { industry, gmail, city } = req;
		console.log('controller');
		const command = new ScrapeBusinessCommand({ industry, gmail, city });
		const event = ScrapeBusinessesDomainEvent.fromPrimitives({
			aggregateId: command.gmail,
			attributes: {
				gmail: command.gmail,
				industry: command.industry,
				city: command.city
			}
		});
		console.log(JSON.stringify(event));
		console.log(this.eventBus);
		this.eventBus.publish(event);
		res.status(httpStatus.ACCEPTED).send();
	}
}
