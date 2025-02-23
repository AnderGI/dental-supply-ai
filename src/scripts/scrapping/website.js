const playwright = require('playwright');
const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// CSV file containing info
const baseURL = 'dentist.csv';

const delayTime = 1000; // 3 seconds

// Array of strings to filter out from emails
const emailFilter = [
    '@sentry-next.wixpress.com', 
    '.png', 
    'sentry.io',
    '@sentry.wixpress.com',
    '@wix.com',
];

// Function to scrape emails from a given URL
async function scrapeEmails(url) {
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();

    try {
        // Keep the timeout as 3 seconds
        await page.goto(url, { timeout: delayTime });

        // Wait for the page to load
        await page.waitForLoadState('networkidle');

        // Get the page content
        const content = await page.content();

        // Regular expression to find emails
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        let emailMatches = content.match(emailRegex);

        // Filter out unwanted emails
        if (emailMatches) {
            emailMatches = emailMatches.filter(email => 
                !emailFilter.some(filterItem => email.includes(filterItem))
            );
        }

        return emailMatches ? Array.from(new Set(emailMatches)) : [];
    } catch (error) {
        if (error.name === 'TimeoutError') {
            console.warn(`Timeout when accessing: ${url}`);
            // Return an empty array or handle the error as needed
            return [];
        } else {
            // Handle other types of errors
            throw error;
        }
    } finally {
        await browser.close();
    }
}

// Function to process the CSV file and scrape each website
async function processCsv() {
    const rows = [];
    const headersSet = new Set();
    const batchSize = 5; // Number of websites to process at once

    const readStream = fs.createReadStream(baseURL)
        .pipe(csv());

    const allRows = [];

    for await (const row of readStream) {
        allRows.push(row);
    }

    for (let i = 0; i < allRows.length; i += batchSize) {
        const batch = allRows.slice(i, i + batchSize);
        const batchPromises = batch.map(async row => {
            const newRow = { ...row };
            const website = row.Website || '';

            if (website) {
                console.log(`Scraping: ${website}`);
                const emails = await scrapeEmails(website);
                emails.forEach((email, index) => {
                    const emailHeader = `Email${index + 1}`;
                    newRow[emailHeader] = email;
                    headersSet.add(emailHeader);
                });
            }

            return newRow;
        });

        const batchResults = await Promise.allSettled(batchPromises);
        batchResults.forEach(result => {
            if (result.status === 'fulfilled') {
                rows.push(result.value);
            }
        });
    }

    // Combine original headers with new email headers
    const headers = Object.keys(rows[0]).concat(Array.from(headersSet));

    return { rows, headers };
}


// Function to write the data to a new CSV file
async function writeCsv({ rows, headers }) {
    const outputFileName = baseURL.replace('.csv', '_emails.csv');

    const csvWriter = createCsvWriter({
        path: outputFileName,
        header: headers.map(header => ({ id: header, title: header }))
    });

    await csvWriter.writeRecords(rows);
    console.log(`CSV file written successfully to ${outputFileName}`);
}

// Start the process
processCsv().then(writeCsv);
