const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
//convert the txt file with links seperated by new links into a an array
//for each array element, open it then look for the required phrase if found then return the link url
// check for phrase delivered then create the click event and check for word carrefour in that specific word carrefour


//class name : 
// css-1ycc48i the specific file name equal to Carrefour
// css-1ofx64m check this class if every any tags equal to the required phrases So this
{/* <span class="css-12cl38p">Sold &amp; Delivered by  Carrefour</span> */}
const links_opened = 0;

async function scrapeWebsite(url) {
    try 
    {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        // You can perform your scraping here using page.evaluate() or other Puppeteer methods.
        const content = await page.content();
        // Load the page content into Cheerio
        const $ = cheerio.load(content);
        // Search for the phrase in any HTML tag's content
        const elementExists = await page.waitForSelector('div.css-1ycc48i:contains("Carrefour")');
        const elementExists2 = await page.waitForXPath('//span[contains(@class, "css-12cl38p") and contains(text(), "Sold & Delivered by Carrefour")]');
        if(elementExists || elementExists2)
        {
            console.log(`Found "Sold & Delivered by Carrefour" in page: ${url}`);
        }
        
        // $('css-1ycc48i').each((index, element) => {
        //     const tagText = $(element).text();
        //     if (tagText.includes('Carrefour')) 
        //     {
        //         console.log(`Found "Sold & Delivered by Carrefour" in page: ${url}`);
        //     }
        // });
        // $('css-1ofx64m').each((index, element) => 
        // {
        //     const tagText = $(element).text();
        //     if (tagText.includes('Sold & Delivered by Carrefour')) {
        //         console.log(`Found "Sold & Delivered by Carrefour" in page: ${url}`);
        //     };
        // });
        console.log("finished");
        await browser.close();
    } 
    catch (error) 
    {
        console.error('Error:', error.message);
    }
}

async function start()
{
    const inputFilePath = './output.txt';
    const textFromFile = fs.readFileSync(inputFilePath, 'utf-8');
    const linksArray = textFromFile.split('\n').filter(link => link.trim() !== '');
    await scrapeWebsite("https://www.carrefouruae.com/mafuae/en/2in1-convertibles/hp-2in1-p-14ek0025-i7-1255-16-512-s/p/1936452?offer=offer_carrefour_");
    console.log("here");
    for (const url of linksArray) 
    {
    await scrapeWebsite(url);
    }
}

start();
