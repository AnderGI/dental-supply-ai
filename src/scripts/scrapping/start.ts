/* eslint-disable @typescript-eslint/no-unsafe-call */
import fs from 'fs';
import { chromium } from 'playwright';

const CLINICAS_GETXO = 'https://www.google.com/maps/search/clinicas+dentales+en+getxo';

async function setup() {
	console.time('Execution Time');
	const browser = await chromium.launch({ headless: true }); // headless en false para ver el proceso
	const page = await browser.newPage();
	await page.goto(CLINICAS_GETXO, { waitUntil: 'domcontentloaded' });

	// Intentar aceptar las cookies si aparecen
	const acceptButton = await page.$('button:has-text("Aceptar todo")');
	if (acceptButton) {
		await acceptButton.click();
		await page.waitForTimeout(2000); // Espera para que la página se actualice
	}

	// Espera a que se cargue el elemento que contiene la lista
	await page.waitForSelector('[jstcache="3"]');

	const scrollable = await page.$(
		'xpath=/html/body/div[2]/div[3]/div[8]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[1]/div[1]'
	);
	if (!scrollable) {
		console.log('Scrollable element not found.');
		await browser.close();

		return;
	}

	// // Realiza scroll hasta que se encuentre el mensaje "Has llegado al final de la lista."
	// let endOfList = false;
	// while (!endOfList) {
	// 	// eslint-disable-next-line no-await-in-loop
	// 	await scrollable.evaluate(node => node.scrollBy(0, 70000));
	// 	// eslint-disable-next-line no-await-in-loop
	// 	// await page.waitForTimeout(2000); // Espera a que se cargue más contenido
	// 	// eslint-disable-next-line no-await-in-loop
	// 	endOfList = await page.evaluate(() => document.body.innerText.includes('final de la lista.'));
	// }

	// Realiza scroll hasta que se encuentre el mensaje "final de la lista." visible en el viewport
	let endOfList = false;
	while (!endOfList) {
		// Realiza scroll en el contenedor
		// eslint-disable-next-line no-await-in-loop
		await scrollable.evaluate(node => node.scrollBy(0, 70000));
		// Espera un poco para que se cargue el contenido
		// eslint-disable-next-line no-await-in-loop
		await page.waitForTimeout(2000);

		// Verifica si algún elemento que contenga el texto "final de la lista." está visible en la ventana
		// eslint-disable-next-line no-await-in-loop
		endOfList = await page.evaluate(() => {
			const elements: HTMLElement[] = Array.from(document.querySelectorAll('*'));

			return elements.some(el => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (el.innerText && el.innerText.includes('final de la lista.')) {
					const rect = el.getBoundingClientRect();

					// El elemento se considera visible si su parte superior está a 0 o más y su parte inferior no excede la altura de la ventana
					return rect.top >= 0 && rect.bottom <= window.innerHeight;
				}

				return false;
			});
		});
	}

	await page.waitForTimeout(5000);

	// Ejecuta la función de scraping en el contexto de la página
	const data = await page.evaluate(() => {
		function scrapeData() {
			let title = '';
			let rating = '';
			let reviews = '';
			let industry = '';
			let address = '';
			let phone = '';
			let web = '';
			const personalDataContainer = Array.from(
				document.querySelectorAll('div.UaQhfb.fontBodyMedium')
			);

			return personalDataContainer.map(element => {
				const titleDiv = element.querySelector(':scope > div:first-child');
				title = titleDiv?.querySelector('.fontHeadlineSmall')?.textContent ?? '';

				const ratingAndReviewsDiv = element.querySelector(':scope > div:nth-child(3)');
				const ratingAndReviewsData = ratingAndReviewsDiv?.querySelector(
					'span.e4rVHe.fontBodyMedium > span[role="img"]'
				);
				if (ratingAndReviewsData) {
					const text = ratingAndReviewsData.ariaLabel?.split(' ');
					rating = text ? text[0] : '';
					reviews = text ? text[2] : '';
				}

				const addressIndustryPhoneDiv = element.querySelector(':scope > div:last-child');
				industry =
					addressIndustryPhoneDiv?.querySelector(':scope > div:first-child > span > span')
						?.textContent ?? '';
				address =
					addressIndustryPhoneDiv?.querySelector(
						':scope > div:first-child > span:last-child > span:last-child'
					)?.textContent ?? '';
				phone =
					addressIndustryPhoneDiv?.querySelector(
						':scope > div:last-child > span:last-child > span:last-child'
					)?.textContent ?? '';

				const link =
					element.parentElement?.parentElement?.parentElement?.parentElement?.querySelector<HTMLAnchorElement>(
						':scope a'
					);
				web = link?.href ?? '';

				return { title, rating, reviews, industry, address, phone, web };
			});
		}

		return scrapeData();
	});

	await browser.close();
	console.timeEnd('Execution Time');
	// Guarda los datos extraídos en un archivo JSON
	fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');
	console.log('Data saved to data.json');
}

setup().catch(err => console.error(err));
