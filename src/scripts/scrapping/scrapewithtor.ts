/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-await-in-loop */
import net, { Socket } from 'net';
import { Browser, chromium, Page } from 'playwright';

interface TorParams {
	host: string;
	port: number;
	password: string;
}

/* =================== CONTROL DE TOR =================== */

/**
 * Conecta al ControlPort de Tor y retorna una promesa con el socket.
 */
async function connectToTorControl({ host, port }: TorParams): Promise<Socket> {
	return new Promise((resolve, reject) => {
		const socket: Socket = net.connect({ host, port }, () => {
			console.log('Conectado al Tor ControlPort');
			resolve(socket);
		});
		socket.on('error', reject);
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

/**
 * Rota la IP de Tor conectándose al ControlPort, autenticándose y enviando SIGNAL NEWNYM.
 */
async function rotateTor(params: TorParams): Promise<void> {
	try {
		const socket = await connectToTorControl(params);
		const authResponse = await sendCommand(socket, `AUTHENTICATE "${params.password}"`);
		console.log('Respuesta de AUTHENTICATE:', authResponse);
		if (!authResponse.includes('250')) {
			throw new Error('Autenticación fallida');
		}
		const newnymResponse = await sendCommand(socket, 'SIGNAL NEWNYM');
		console.log('Respuesta de SIGNAL NEWNYM:', newnymResponse);
		await sendCommand(socket, 'QUIT');
		socket.end();
	} catch (error) {
		console.error('Error rotando IP en Tor:', error);
	}
}

/* =================== FUNCIONES CON PLAYWRIGHT =================== */

/**
 * Consulta la IP pública usando la API de ipify y la muestra.
 */
async function getPublicIp(page: Page): Promise<string> {
	console.log('Consultando IP pública...');
	await page.goto('https://api.ipify.org?format=json', {
		waitUntil: 'networkidle',
		timeout: 30000
	});
	// Extrae el contenido (JSON) y parsea la IP
	const ipJson = await page.content();
	try {
		// Extrae la parte JSON (removiendo etiquetas HTML si las hubiera)
		const match = ipJson.match(/{.+}/);
		if (match) {
			const data = JSON.parse(match[0]);
			console.log('IP de salida a través de Tor:', data.ip);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return data.ip;
		}
		throw new Error('No se encontró JSON en la respuesta.');
	} catch (error) {
		console.error('Error al parsear la IP:', error);

		return 'Desconocida';
	}
}

/**
 * Intenta acceder a una página con Playwright usando Tor como proxy.
 * Espera a que la página termine de cargar y luego busca emails en el contenido.
 * En caso de error, rota la IP y vuelve a intentarlo hasta maxAttempts.
 */
async function testPageWithPlaywright(
	url: string,
	browser: Browser,
	maxAttempts = 3
): Promise<{ content: string; emails: string[] }> {
	let attempts = 0;
	let page: Page | undefined = undefined;
	// Expresión regular para emails: se asegura de que el TLD sea de al menos 2 letras y evita punto final adicional
	const emailRegex = new RegExp('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', 'g');

	while (attempts < maxAttempts) {
		try {
			page = await browser.newPage();
			console.log(`Intento ${attempts + 1}: Navegando a ${url}`);
			await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
			// Espera extra para que se cargue contenido dinámico
			await page.waitForTimeout(5000);
			const content = await page.content();
			const foundMatches = content.match(emailRegex) ?? [];
			const foundEmails = new Set<string>(foundMatches);

			if (foundEmails.size > 0) {
				const uniqueEmails = Array.from(foundEmails);
				console.log('Emails encontrados:', uniqueEmails);

				return { content, emails: uniqueEmails };
			}
			console.log('No se encontraron emails en el contenido.');
			throw new Error('No se encontró email en la página.');
		} catch (error) {
			console.error(`Error en intento ${attempts + 1}: ${error}`);
			attempts++;
			// Rota la IP a través del ControlPort de Tor
			await rotateTor({ host: '127.0.0.1', port: 9051, password: '#A1n2d3e4r5T0r' });
			// Espera unos segundos para que Tor establezca un nuevo circuito
			await new Promise(resolve => setTimeout(resolve, 10000));
		} finally {
			if (page) {
				await page.close();
			}
		}
	}
	throw new Error(
		'No se pudo acceder a la página o encontrar un email después de varios intentos.'
	);
}

/* =================== MAIN =================== */

async function main(): Promise<void> {
	const url = 'https://www.aixerrotadental.es/';
	// Lanza Chromium configurando el proxy para que use Tor (socks5://127.0.0.1:9050)
	const browser = await chromium.launch({
		headless: false,
		proxy: { server: 'socks5://127.0.0.1:9050' }
	});

	try {
		// Primero, abrir una página para consultar la IP
		const pageForIp = await browser.newPage();
		const ip = await getPublicIp(pageForIp);
		console.log(`La IP con la que se realiza la llamada es: ${ip}`);
		await pageForIp.close();

		// Ahora, intenta obtener la página de destino y extraer emails
		const result = await testPageWithPlaywright(url, browser);
		console.log('Contenido de la página:', result.content);
		console.log('Emails encontrados:', result.emails);
	} catch (error) {
		console.error('Error final al acceder a la página:', error);
	} finally {
		await browser.close();
	}
}

main().catch(console.error);
