import * as fs from 'faker';

import RegisterClientCommand from '../../../../../../src/contexts/backoffice/clients/application/register/RegisterClientCommand';

export class RegisterClientCommandMother {
	static random(): RegisterClientCommand {
		const primitives = {
			id: fs.datatype.uuid(),
			name: fs.name.firstName(),
			email: fs.internet.email(),
			phone: fs.phone.phoneNumber(),
			company: fs.company.companyName(),
			position: fs.name.jobType()
		};

		return new RegisterClientCommand(primitives);
	}
}
