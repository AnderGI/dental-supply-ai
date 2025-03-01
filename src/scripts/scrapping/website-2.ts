/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-await-in-loop */
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { URL } from 'url';

// Expresión regular para detectar correos electrónicos en el HTML
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

/**
 * Función para obtener el contenido HTML de una página usando `fetch`
 */
async function fetchPage(url: string): Promise<string | null> {
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'User-Agent': 'Mozilla/5.0' // Simula un navegador real
			}
		});

		if (!response.ok) {
			console.error(`❌ Error al obtener ${url}: HTTP ${response.status}`);

			return null;
		}

		return await response.text();
	} catch (error) {
		console.error(`❌ Error en la solicitud a ${url}: ${(error as Error).message}`);

		return null;
	}
}

/**
 * Extrae enlaces internos de una página y filtra solo aquellos que contienen `/contacto`
 * @param html - Contenido HTML de la página
 * @param baseUrl - URL base para resolver enlaces relativos
 * @returns Lista de URLs internas únicas que cumplen la condición
 */
function extractRelevantPages(html: string, baseUrl: string): string[] {
	const $ = cheerio.load(html);
	const links: Set<string> = new Set();

	$('a[href]').each((_, element) => {
		const href: string | undefined = $(element).attr('href');
		if (href) {
			try {
				const absoluteUrl: string = new URL(href, baseUrl).href;
				// 🔍 Filtrar URLs que contengan `/contacto`
				if (absoluteUrl.includes('/contacto')) {
					links.add(absoluteUrl);
				}
			} catch (err) {
				console.error(`⚠️ URL inválida: ${href}`);
			}
		}
	});

	return Array.from(links);
}

/**
 * Extrae correos electrónicos de una página HTML
 * @param html - Contenido HTML de la página
 * @returns Lista de correos electrónicos encontrados
 */
function extractEmails(html: string): string[] {
	const emails: Set<string> = new Set();
	const matches = html.match(emailRegex);
	if (matches) {
		matches.forEach(email => emails.add(email));
	}

	return Array.from(emails);
}

/**
 * Encuentra todas las subpáginas con `/contacto` o que contengan correos electrónicos en su HTML.
 * Luego, extrae los correos electrónicos de esas páginas.
 * @param startUrl - URL inicial desde donde comenzar la exploración
 * @returns Un objeto con las URLs relevantes y sus respectivos correos electrónicos
 */
async function findEmails(startUrl: string): Promise<Map<string, string[]>> {
	const visited: Set<string> = new Set();
	const toVisit: Set<string> = new Set([startUrl]);
	const emailsFound: Map<string, string[]> = new Map();

	while (toVisit.size > 0) {
		const urls: string[] = Array.from(toVisit);
		toVisit.clear(); // Limpiamos la lista de pendientes

		await Promise.all(
			urls.map(async (url: string) => {
				if (visited.has(url)) {
					return;
				}
				visited.add(url);

				console.log(`🔍 Explorando enlaces en: ${url}`);
				const html: string | null = await fetchPage(url);
				if (!html) {
					return;
				}

				// Extraemos correos electrónicos de la página
				const emails = extractEmails(html);
				if (emails.length > 0) {
					emailsFound.set(url, emails);
				}

				// Extraemos solo enlaces relevantes
				const newLinks: string[] = extractRelevantPages(html, startUrl);
				newLinks.forEach((link: string) => {
					if (!visited.has(link)) {
						toVisit.add(link);
					}
				});
			})
		);
	}

	return emailsFound;
}

/**
 * Ejecutar el scraper para obtener todas las páginas relevantes y extraer los correos electrónicos
 */
async function main(): Promise<void> {
	const targetUrl = 'https://odontofamily.es/'; // Cambia esta URL por la que quieras scrapear
	console.log(
		`🚀 Iniciando búsqueda de emails en páginas con "/contacto" o que contengan correos en ${targetUrl}`
	);

	console.time('Exploración de Emails');

	// Encuentra los correos electrónicos en las páginas de contacto o en páginas con emails en el HTML
	const emailsMap: Map<string, string[]> = await findEmails(targetUrl);

	// Imprimir los correos encontrados
	emailsMap.forEach((emails, url) => {
		console.log(`📌 Emails encontrados en ${url}:`, emails);
	});

	console.log(`✅ Se encontraron emails en ${emailsMap.size} páginas.`);
	console.timeEnd('Exploración de Emails');
}

// Ejecutar el script
main();
