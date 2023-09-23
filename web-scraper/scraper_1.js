const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Define the URL of the website you want to start scraping from
const startUrl = 'https://www.carrefouruae.com/mafuae/en/v4/search?keyword=lenovo%20laptop'; // Replace with your target URL


async function interactWithLoadMoreButton(page) 
{
    // Find the "Load More" button
    const loadMoreButtonSelector = 'button.css-1kcfjo3[data-testid="trolly-button"]'; // Adjust the selector as needed

	await page.evaluate(() => {
		window.scrollBy(0, window.innerHeight);
	});
    try {
        const loadMoreButton = await page.$(loadMoreButtonSelector);

        if (loadMoreButton) {
            // Click the "Load More" button using Puppeteer
            await loadMoreButton.click();
			console.log('Clicked "Load More" button');
            // Wait for some time for the new content to load
            await page.waitForTimeout(2000); // Adjust the waiting time as needed

            // Recursively call the interactWithLoadMoreButton function
            await interactWithLoadMoreButton(page);
        }
    } catch (error) {
        console.error('Error interacting with "Load More" button:', error.message);
    }
}

function delay(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
	const allLinks = []

    // Navigate to the initial URL
    await page.goto(startUrl);

    // Call the interactWithLoadMoreButton function to interact with the "Load More" button
    await interactWithLoadMoreButton(page);

    // Get the final HTML content after loading all links
    const finalHtml = await page.content();

    // Load the final HTML content using Cheerio
    const $ = cheerio.load(finalHtml);

	const links = $('.css-lzsise');
    url = 'https://www.carrefouruae.com';
	// Follow each link and scrape its content
	links.find('a').each(async (index, element) => {
		const href = $(element).attr('href');
		const linkUrl = new URL(href, url).href; // Resolve the link URL
		allLinks.push(linkUrl);
		// await delay(5000); 
		// scrapeWebsite(linkUrl);
	})
	console.log("total links: ", allLinks.length);
	fs.writeFile('output_lenovo.txt', allLinks.join('\n'), (err) =>
	 {
		if (err) {
			console.error('Error writing to output.txt:', err);
		} else {
			console.log('All links written to output.txt');
		}
	});
	// Close Puppeteer browser
	await browser.close();
})();