// import { Tor } from 'tor-control-ts';

// async function main() {
// 	const tor = new Tor({
// 		host: 'localhost',
// 		port: 9051,
// 		password: '#A1n2d3e4r5T0r'
// 	});

// 	await tor.connect(); // connect tor client

// 	await tor.signalNewnym(); // change tor ip

// 	// const response = await tor.getConf('config-file'); // get config file
// 	// console.log(response);
// 	// sample response:
// 	// { type: 250,
// 	//  message: 'OK',
// 	//  data: '250-config-file=/usr/local/etc/tor/torrc\r\n250 OK\r\n'
// 	// }

// 	await tor.quit(); //
// }

// main().catch(e => console.error(e));

import net, { Socket } from 'net';

interface TorParams {
	host: string;
	port: number;
	password: string;
}

/**
 * Conecta al ControlPort de Tor y retorna una promesa con el socket.
 */
async function connectToTorControl({ host, port }: TorParams): Promise<Socket> {
	return new Promise((resolve, reject) => {
		const socket: Socket = net.connect({ host, port }, () => {
			console.log('Conectado al Tor ControlPort');
			resolve(socket);
		});
		socket.on('error', err => {
			reject(err);
		});
	});
}

/**
 * Envía un comando al socket y espera la respuesta completa.
 */
async function sendCommand(socket: Socket, command: string): Promise<string> {
	return new Promise((resolve, reject) => {
		let dataBuffer = '';

		const onData = (data: Buffer) => {
			dataBuffer += data.toString();
			// Suponemos que la respuesta termina con "\r\n"
			if (dataBuffer.endsWith('\r\n')) {
				socket.removeListener('data', onData);
				resolve(dataBuffer);
			}
		};

		socket.on('data', onData);
		console.log('Enviando comando:', command);
		socket.write(`${command}\r\n`, (err?: Error) => {
			if (err) {
				reject(err);
			}
		});
	});
}

async function main(): Promise<void> {
	const params: TorParams = {
		host: '127.0.0.1',
		port: 9051,
		password: '#A1n2d3e4r5T0r' // Contraseña en texto plano
	};

	try {
		// Conectar al ControlPort
		const socket = await connectToTorControl(params);

		// Autenticarse
		let response = await sendCommand(socket, `AUTHENTICATE "${params.password}"`);
		console.log('Respuesta de AUTHENTICATE:', response);

		if (!response.includes('250')) {
			throw new Error('Autenticación fallida');
		}

		// Enviar la señal NEWNYM para solicitar un nuevo circuito
		response = await sendCommand(socket, 'SIGNAL NEWNYM');
		console.log('Respuesta de SIGNAL NEWNYM:', response);

		// Enviar QUIT para cerrar la conexión
		response = await sendCommand(socket, 'QUIT');
		console.log('Respuesta de QUIT:', response);

		socket.end();
	} catch (error) {
		console.error('Error en la comunicación con Tor:', error);
	}
}

main().catch(console.error);
