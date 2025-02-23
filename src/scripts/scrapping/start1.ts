import { chromium } from 'playwright';

const CLINICAS_GETXO = 'https://www.google.com/maps/search/clinicas+dentales+en+getxo';

async function setup() {
	console.time('Execution Time');
	const browser = await chromium.launch({ headless: false });
	const page = await browser.newPage();
	await page.goto(CLINICAS_GETXO, { waitUntil: 'domcontentloaded' });

	// Intentar aceptar las cookies si aparecen
	const acceptButton = await page.$('button:has-text("Aceptar todo")');
	if (acceptButton) {
		await acceptButton.click();
		await page.waitForTimeout(2000); // Esperar un poco para que la página cargue
	}

	await page.waitForSelector('[jstcache="3"]');

	const scrollable = await page.$(
		'xpath=/html/body/div[2]/div[3]/div[8]/div[9]/div/div/div[1]/div[2]/div/div[1]/div/div/div[1]/div[1]'
	);
	if (!scrollable) {
		console.log('Scrollable element not found.');
		await browser.close();

		return;
	}

	let endOfList = false;
	while (!endOfList) {
		// eslint-disable-next-line no-await-in-loop
		await scrollable.evaluate(node => node.scrollBy(0, 50000));
		// eslint-disable-next-line no-await-in-loop
		endOfList = await page.evaluate(() =>
			document.body.innerText.includes('Has llegado al final de la lista.')
		);
	}

	await browser.close();
	console.timeEnd('Execution Time');
}

setup().catch(err => console.error(err));
