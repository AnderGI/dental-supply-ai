import https from 'https';
import { SocksProxyAgent } from 'socks-proxy-agent';

// Configura el agente usando el proxy SOCKS (Tor, por ejemplo)
const agent = new SocksProxyAgent('socks5h://127.0.0.1:9050');

// Realiza la petición GET a https://api.ipify.org (texto plano)
https
	.get('https://www.aixerrotadental.es/', { agent }, res => {
		let rawData = '';

		// Acumula los datos que llegan
		res.on('data', chunk => {
			rawData += chunk;
		});

		// Cuando termina la transmisión, muestra la IP en consola
		res.on('end', () => {
			console.log('IP devuelta:', rawData.trim());
		});
	})
	.on('error', err => {
		console.error('Error en la petición:', err);
	});
