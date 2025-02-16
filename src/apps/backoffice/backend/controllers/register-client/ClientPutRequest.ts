export default interface ClientPutRequest extends Request {
	id: string;
	name: string;
	email: string;
	phone: string;
	company: string;
	position: string;
}
