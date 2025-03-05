import { AggregateRoot } from '../../../shared/domain/AggregateRoot';

type BusinessPrimitives = {
	readonly gmail: string;
	readonly industry: string;
	readonly city: string;
};
export default class Business implements AggregateRoot {
	constructor(
		private readonly gmail: string,
		private readonly industry: string,
		private readonly city: string
	) {}

	toPrimitives(): BusinessPrimitives {
		const { gmail, industry, city } = this;

		return {
			gmail,
			industry,
			city
		};
	}
}
