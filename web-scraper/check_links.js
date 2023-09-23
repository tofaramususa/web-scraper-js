const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { exit } = require('process');
//convert the txt file with links seperated by new links into a an array
//for each array element, open it then look for the required phrase if found then return the link url
// check for phrase delivered then create the click event and check for word carrefour in that specific word carrefour


//class name : 
// css-1ycc48i the specific file name equal to Carrefour
// css-1ofx64m check this class if every any tags equal to the required phrases So this
{/* <span class="css-12cl38p">Sold &amp; Delivered by  Carrefour</span> */}
let links_opened = 0;

async function scrapeWebsite(url) 
{
    try 
    {
        const browser = await puppeteer.launch({headless: "new",});
        const page = await browser.newPage();
        await page.goto(url);
  // Find the div containing the links
		const divSelector = 'section.css-1epuv91 div.css-1ofx64m';
		const divElements = await page.$$(divSelector);

		// Loop through each div element
		for (const divElement of divElements) 
		{
			// Check if the div contains a link
			const linkSelector = 'a.css-1t276eh';
			const linkElement = await divElement.$(linkSelector);

			if (linkElement) 
			{
				// If a link is found, click it
				await linkElement.click();
				// console.log("Clicked link within div");
			}
		}
	// Click the link
        const content = await page.content();
		links_opened++;
		// exit();
		// console.log(content);
		if (content.includes("Sold &amp; Delivered by  Carrefour") || content.includes("<div class=\"css-1ycc48i\">Carrefour</div>"))
		{
			fs.appendFile('urls1.txt', url + "\n", (err) =>
			{
			   if (err) 
			   {
				   console.error('Error writing to urls.txt:', err);
			   }
		   });
		}
        console.log("links checked : " + links_opened);
        await browser.close();
    } 
    catch (error) 
    {
        console.error('Error:', error.message);
    }
}

async function start()
{
    const inputFilePath = './output_lenovo.txt';
    const textFromFile = fs.readFileSync(inputFilePath, 'utf-8');
    const linksArray = textFromFile.split('\n').filter(link => link.trim() !== '');
    // await scrapeWebsite("https://www.carrefouruae.com/mafuae/en/2in1-convertibles/hp-2in1-p-14ek0025-i7-1255-16-512-s/p/1936452?offer=offer_carrefour_");
    // console.log("here");
	// for (const url of linksArray) 
	// {
	// 	console.log(url);
	// }
    for (const url of linksArray) 
    {
    await scrapeWebsite(url);
    }
}

start();
exit();
