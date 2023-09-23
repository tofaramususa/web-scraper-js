const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { exit } = require('process');

// Define the URL of the website you want to start scraping from
const startUrl = 'https://www.carrefouruae.com/mafuae/en/v4/search?currentPage=0&filter=&keyword=hp%2016gb&maxPrice=4074&minPrice=1249&nextPageOffset=0&pageSize=60&sortBy=relevance'; // Replace with your target URL


async function interactWithLoadMoreButton(page) {
    // Find the "Load More" button
    const loadMoreButtonSelector = 'button.css-1kcfjo3[data-testid="trolly-button"]'; // Adjust the selector as needed

    try {
        const loadMoreButton = await page.$(loadMoreButtonSelector);

        if (loadMoreButton) {
            // Scroll down a bit to bring the button into view
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight);
            });

            // Wait for a random amount of time (e.g., between 2 to 5 seconds)
            const randomWaitTime = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
            console.log(`Waiting for ${randomWaitTime / 1000} seconds...`);
            await page.waitForTimeout(randomWaitTime);

            // Click the "Load More" button using Puppeteer
            await loadMoreButton.click();
            console.log('Clicked "Load More" button');

            // Wait for some time for the new content to load
            const loadTime = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
            console.log(`Waiting for new content to load (${loadTime / 1000} seconds)...`);
            await page.waitForTimeout(loadTime);

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

function removeDuplicates(array) 
{
    return [...new Set(array)];
}

(async () => {
    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
	const allLinks = []

    // Navigate to the initial URL
    await page.goto(startUrl);

    // Call the interactWithLoadMoreButton function to interact with the "Load More" button
    // await interactWithLoadMoreButton(page);

    // Get the final HTML content after loading all links
    const finalHtml = await page.content();
    // Load the final HTML content using Cheerio
    const $ = cheerio.load(finalHtml);

	const links = $('div.css-tuzc44 a');
    url = 'https://www.carrefouruae.com';
	// Follow each link and scrape its content
	links.each(async (index, element) => 
	{
		const href = $(element).attr('href');
		const linkUrl = new URL(href, url).href; // Resolve the link URL
		allLinks.push(linkUrl);
		// await delay(5000); 
		// scrapeWebsite(linkUrl);
	})
	const newArray = removeDuplicates(allLinks);
	console.log("total links: ", newArray.length);
	fs.appendFile('Links/new_links_to_check.txt', newArray.join('\n'), (err) =>
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