import { Response } from 'express';
import httpStatus from 'http-status';

import RegisterClientCommand from '../../../../../contexts/backoffice/client/application/register/RegisterClientCommand';
import CommandBus from '../../../../../shared/domain/command/CommandBus';
import { Controller } from '../../../../../shared/domain/Controller';
import ClientPutRequest from './ClientPutRequest';

export default class ClientPutController implements Controller<ClientPutRequest> {
	constructor(private readonly commandBus: CommandBus) {}
	run(req: ClientPutRequest, res: Response): void {
		const { id, name, email, phone, company, position } = req;
		const data = {
			id,
			name,
			email,
			phone,
			company,
			position
		};
		const command = new RegisterClientCommand(data);
		this.commandBus.dispatch(command);
		res.status(httpStatus.ACCEPTED).send();
	}
}
