import Command from '../../../../../shared/domain/command/Command';

type CreateClientPrimitives = {
	id: string;
	name: string;
	email: string;
	phone: string;
	company: string;
	position: string;
};
export default class RegisterClientCommand implements Command {
	constructor(readonly data: CreateClientPrimitives) {}
}
