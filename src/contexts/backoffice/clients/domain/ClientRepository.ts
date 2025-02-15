import Client from './Client';

export default interface ClientRepository {
	save(_: Client): Promise<void>;
}
