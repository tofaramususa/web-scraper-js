// const axios = require('axios');
// const cheerio = require('cheerio');

// // Define the URL of the website you want to scrape
// const url = 'https://www.carrefouruae.com/mafuae/en/v4/search?keyword=16gb%20laptop';

// // Function to scrape the website
// async function scrapeWebsite() {
//     try {
//         // Send an HTTP GET request to the URL
//         const response = await axios.get(url);

//         // Load the HTML content of the page using Cheerio
//         const $ = cheerio.load(response.data);

//         // Find all links on the page
//         $('a').each((index, element) => {
//             const linkText = $(element).text();
//             const href = $(element).attr('href');

//             // Check if the link text contains the desired phrase
//             if (linkText.includes("Sold&amp; Delivered by  Carrefour")) {
//                 console.log(href);  // Print the URL of the page
//             }
//         });
//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// }

// // Call the scraping function
// scrapeWebsite();

const axios = require('axios');
const cheerio = require('cheerio');

// Define the URL of the website you want to start scraping from
const startUrl = 'https://www.carrefouruae.com/mafuae/en/c/NF4070500'; // Replace with the actual URL

// Function to scrape the website
async function scrapeWebsite(url) {
   try {
       // Send an HTTP GET request to the URL
       const response = await axios.get(url);

       // Load the HTML content of the page using Cheerio
       const $ = cheerio.load(response.data);

       // Check if the page contains the phrase "delivered"
       if ($('body').text().includes('Sold&amp; Delivered by  Carrefour')) {
           console.log(`Found "delivered" in page: ${url}`);
       }

       // Find all links on the page
       const links = $('a');
       
       // Follow each link and scrape its content
       for (let i = 0; i < links.length; i++) {
           const href = $(links[i]).attr('href');
           const linkUrl = new URL(href, url).href; // Resolve the link URL
           console.log(`Checking link: ${linkUrl}`);
           
           // Recursively call the scrapeWebsite function for each link
           await scrapeWebsite(linkUrl);
       }
   } catch (error) {
       console.error('Error:', error.message);
   }
}

// Call the scraping function to start from the initial URL
scrapeWebsite(startUrl);
