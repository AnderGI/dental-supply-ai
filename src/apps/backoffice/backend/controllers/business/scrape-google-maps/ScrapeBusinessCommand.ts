import Command from '../../../../../../shared/domain/command/Command';

interface ScrapeBusinessPayload {
	industry: string;
	gmail: string;
	city: string;
}

export default class ScrapeBusinessCommand implements Command {
	readonly industry: string;
	readonly gmail: string;
	readonly city: string;

	constructor({ industry, gmail, city }: ScrapeBusinessPayload) {
		this.industry = industry;
		this.gmail = gmail;
		this.city = city;
	}
}
