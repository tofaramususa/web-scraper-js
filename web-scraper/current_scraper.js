const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { exit } = require('process');

// Define the URL of the website you want to start scraping from
const startUrl = 'https://www.carrefouruae.com/mafuae/en/v4/search?keyword=hp%20laptop%2016gb%20pavillion'; // Replace with your target URL


async function interactWithLoadMoreButton(page) 
{
    // Find the "Load More" button
    const loadMoreButtonSelector = 'button.css-1kcfjo3[data-testid="trolly-button"]'; // Adjust the selector as needed

    try {
        const loadMoreButton = await page.$(loadMoreButtonSelector);

        if (loadMoreButton) 
        {
            // Scroll down a bit to bring the button into view
            const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
            const screenHeight = await page.evaluate(() => window.innerHeight);
            const step = screenHeight / 10; // Adjust the step size as needed
          
            let scrollY = 0;
            while (scrollY + screenHeight < scrollHeight) 
            {
              await page.evaluate((step) => {
                window.scrollBy(0, step);
              }, step);
          
              // Wait for a short interval to simulate human-like scrolling
              await page.waitForTimeout(100); // Adjust the interval as needed
              scrollY += step;
            }
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

(async () => 
{
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
	const allLinks = [];

    await page.goto(startUrl);
    await interactWithLoadMoreButton(page);
    const finalHtml = await page.content();
    // console.log(finalHtml);
    const $ = cheerio.load(finalHtml);
	const links = $('div.css-b9nx4o a'); //here need to change something
    url = 'https://www.carrefouruae.com';
	console.log("number of links: " + links.length);
	for (let index = 0; index < links.length; index++) 
	{
        const element = links[index];
        const href = $(element).attr('href');
        const linkUrl = new URL(href, url).href; // Resolve the link URL
        allLinks.push(linkUrl);
        // await delay(5000); 
        // scrapeWebsite(linkUrl);
    }
	const newArray = removeDuplicates(allLinks);
	console.log("total links: ", newArray.length);
	fs.appendFile('Links/new_links_to_check.txt', newArray.join('\n'), (err) =>
	 {
		if (err) {
			console.error('Error writing to links', err);
		} else {
			console.log('All links written successfully!');
		}
	});
	// Close Puppeteer browser
	await browser.close();
})();