import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { EventBus } from '../../../shared/domain/event/EventBus';
import RegisterClientCommand from '../application/register/RegisterClientCommand';
import ClientCompany from './ClientCompany';
import ClientEmail from './ClientEmail';
import ClientId from './ClientId';
import ClientName from './ClientName';
import ClientPhone from './ClientPhone';
import ClientPosition from './ClientPosition';
import ClientRepository from './ClientRepository';
import ClientSaver from './save/ClientSaver';

type ClientPrimitives = {
	id: string;
	name: string;
	email: string;
	phone: string;
	company: string;
	position: string;
};
export default class Client implements AggregateRoot {
	constructor(
		readonly id: ClientId,
		readonly name: ClientName,
		readonly email: ClientEmail,
		readonly phone: ClientPhone,
		readonly company: ClientCompany,
		readonly position: ClientPosition
	) {}

	public static create(_: ClientPrimitives): Client {
		return new Client(
			new ClientId(_.id),
			new ClientName(_.name),
			new ClientEmail(_.email),
			new ClientPhone(_.phone),
			new ClientCompany(_.company),
			new ClientPosition(_.position)
		);
	}

	public static fromPrimitives(_: ClientPrimitives): Client {
		return new Client(
			new ClientId(_.id),
			new ClientName(_.name),
			new ClientEmail(_.email),
			new ClientPhone(_.phone),
			new ClientCompany(_.company),
			new ClientPosition(_.position)
		);
	}

	static save(command: RegisterClientCommand) {
		return async (repository: ClientRepository, eventBus: EventBus): Promise<void> => {
			await ClientSaver.save(command, repository, eventBus);
		};
	}

	toPrimitives(): ClientPrimitives {
		return {
			id: this.id.getValue(),
			name: this.name.getValue(),
			email: this.email.getValue(),
			phone: this.phone.getValue(),
			company: this.company.getValue(),
			position: this.position.getValue()
		};
	}
}
