import { Server } from './server';

export default class BackofficeBackendApp {
	server?: Server;

	async start(): Promise<void> {
		const port = process.env.PORT ?? '3000';
		this.server = new Server(port);

		return this.server.listen();
	}

	get httpServer(): Server['httpServer'] | undefined {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return this.server?.getHTTPServer();
	}

	async stop(): Promise<void> {
		return this.server?.stop();
	}
}
