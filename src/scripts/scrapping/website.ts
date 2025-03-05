import fs from 'fs';
import { Browser, chromium, Page } from 'playwright';
import { URL } from 'url';

async function scrapeEmailsRecursive(
	page: Page,
	url: string,
	visited: Set<string>,
	emails: Set<string>,
	domain: string,
	depth: number
): Promise<void> {
	if (depth < 0) {
		return;
	}
	if (visited.has(url)) {
		return;
	}
	visited.add(url);

	try {
		console.log(`Scrapeando: ${url}`);
		await page.goto(url, { waitUntil: 'networkidle' });
		// Espera corta para que la página se estabilice
		await page.waitForTimeout(2000);

		// Obtén el contenido HTML y busca emails mediante regex
		const content: string = await page.content();
		const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
		const foundEmails: RegExpMatchArray | null = content.match(emailRegex);
		if (foundEmails) {
			// eslint-disable-next-line array-callback-return
			foundEmails.forEach((email: string) => emails.add(email));
		}

		// Extrae todos los enlaces de la página
		const links: string[] = await page.evaluate((): string[] => {
			return Array.from(document.querySelectorAll('a[href]')).map(
				a => (a as HTMLAnchorElement).href
			);
		});

		// Filtra los enlaces internos que pertenezcan al mismo dominio
		const internalLinks: string[] = links.filter((link: string) => {
			try {
				const linkUrl = new URL(link);

				return linkUrl.hostname.endsWith(domain);
			} catch (e) {
				return false;
			}
		});

		// Recorre recursivamente los enlaces internos
		for (const link of internalLinks) {
			// eslint-disable-next-line no-await-in-loop
			await scrapeEmailsRecursive(page, link, visited, emails, domain, depth - 1);
		}
	} catch (error) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		console.error(`Error scrapeando ${url}: ${error}`);
	}
}

async function main(): Promise<void> {
	console.time('Execution Time');
	const browser: Browser = await chromium.launch({ headless: false });
	const page: Page = await browser.newPage();

	// Cambia este valor por la URL que deseas scrapeear
	const startUrl = 'https://www.aixerrotadental.es/';
	const domain: string = new URL(startUrl).hostname;

	const visited: Set<string> = new Set<string>();
	const emails: Set<string> = new Set<string>();
	const maxDepth = 2; // Ajusta la profundidad de la búsqueda según necesites

	await scrapeEmailsRecursive(page, startUrl, visited, emails, domain, maxDepth);

	console.log('Emails encontrados:', Array.from(emails));
	fs.writeFileSync('emails.json', JSON.stringify(Array.from(emails), null, 2), 'utf-8');
	console.log('Emails guardados en emails.json');

	await browser.close();
	console.timeEnd('Execution Time');
}

main().catch((err: unknown) => console.error(err));
