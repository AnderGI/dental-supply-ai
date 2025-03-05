import fs from 'fs';
import { chromium } from 'playwright';

import Business from '../domain/Business';
import BusinessScrapper from '../domain/BusinessScrapper';

export default class PlaywrightBusinessScrapper implements BusinessScrapper {
	async scrape(business: Business): Promise<void> {
		console.time('Execution Time');
		const browser = await chromium.launch({ headless: true });
		const page = await browser.newPage();
		const url = `https://www.google.com/maps/search/${encodeURIComponent(
			business.toPrimitives().industry
		)}+en+${encodeURIComponent(business.toPrimitives().city)}`;
		console.log(url);
		await page.goto(url, { waitUntil: 'domcontentloaded' });

		// Intentar aceptar las cookies si aparecen
		const acceptButton = await page.$('button:has-text("Aceptar todo")');
		if (acceptButton) {
			await acceptButton.click();
			await page.waitForTimeout(2000);
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
			await scrollable.evaluate(node => node.scrollBy(0, 70000));
			// eslint-disable-next-line no-await-in-loop
			await page.waitForTimeout(2000);

			// eslint-disable-next-line no-await-in-loop
			endOfList = await page.evaluate(() => {
				const elements: HTMLElement[] = Array.from(document.querySelectorAll('*'));

				return elements.some(el => {
					if (el.innerText && el.innerText.includes('final de la lista.')) {
						const rect = el.getBoundingClientRect();

						return rect.top >= 0 && rect.bottom <= window.innerHeight;
					}

					return false;
				});
			});
		}

		await page.waitForTimeout(5000);
		const data = await page.evaluate(() => {
			function scrapeData() {
				return Array.from(document.querySelectorAll('div.UaQhfb.fontBodyMedium')).map(element => {
					const title =
						element.querySelector(':scope > div:first-child .fontHeadlineSmall')?.textContent ?? '';
					const ratingAndReviewsData = element
						.querySelector('span.e4rVHe.fontBodyMedium > span[role="img"]')
						?.ariaLabel?.split(' ');
					const rating = ratingAndReviewsData ? ratingAndReviewsData[0] : '';
					const reviews = ratingAndReviewsData ? ratingAndReviewsData[2] : '';
					const industry =
						element.querySelector(':scope > div:last-child > div:first-child > span > span')
							?.textContent ?? '';
					const address =
						element.querySelector(
							':scope > div:last-child > div:first-child > span:last-child > span:last-child'
						)?.textContent ?? '';
					const phone =
						element.querySelector(
							':scope > div:last-child > div:last-child > span:last-child > span:last-child'
						)?.textContent ?? '';
					const web = element.closest('a')?.href ?? '';

					return { title, rating, reviews, industry, address, phone, web };
				});
			}

			return scrapeData();
		});

		await browser.close();
		console.timeEnd('Execution Time');
		fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');
		console.log('Data saved to data.json');
	}
}
