import Command from '../../../../../shared/domain/command/Command';
import CommandHandler from '../../../../../shared/domain/command/CommandHandler';
import ClientRegistrar from './ClientRegistrar';
import RegisterClientCommand from './RegisterClientCommand';

export default class RegisterClientCommandHandler implements CommandHandler<RegisterClientCommand> {
	constructor(private readonly registrar: ClientRegistrar) {}

	subscribedTo(): Command {
		return RegisterClientCommand;
	}

	async handle(command: RegisterClientCommand): Promise<void> {
		await this.registrar.registar(command);
	}
}
