	// else if(content.includes("Sold &amp; Delivered by  Carrefour"))
		// {
		// 	console.log(`Found "Carrefour" in page: ${url}`);;
		// }
		// exit();
        // Load the page content into Cheerio
        // const $ = cheerio.load(content);
        // Search for the phrase in any HTML tag's content
        // const elementExists = await page.waitForSelector('div.css-1ycc48i:contains("Carrefour")');
        // const elementExists2 = await page.waitForXPath('//span[contains(@class, "css-12cl38p") and contains(text(), "Sold & Delivered by Carrefour")]');
        // if(elementExists || elementExists2)
        // {
        //     console.log(`Found "Sold & Delivered by Carrefour" in page: ${url}`);
        // }
        
        // $('div.css-1ycc48i').each((index, element) => {
        //     const $div = $(element);
        //     if ($div.text().includes('Carrefour') || $div.find('*').text().includes('Carrefour')) {
        //         console.log(`Found "Carrefour" in page: ${url}`);
        //     }
        // });

        // Check for the phrase "Sold & Delivered by Carrefour" in elements with the class "css-1ofx64m" and their descendants
        // $('div.css-1ofx64m').each((index, element) => {
        //     const $div = $(element);
        //     if (
        //         $div.text().includes('Sold & Delivered by Carrefour') ||
        //         $div.find('*').text().includes('Sold & Delivered by Carrefour')
        //     ) {
        //         console.log(`Found "Sold & Delivered by Carrefour" in page: ${url}`);
		// 	}
        // });

					// console.log(`Found "Sold & Delivered by Carrefour" in page: ${url}`);
		// Wait for the link with the specified class to appear
		// const sellerSelector = 'div.css-1ofx64m a.css-1t276eh';
		// const selectSeller = await page.$(sellerSelector);
		// try 
		// 	{
		// 	if(selectSeller)
		// 		{
		// 			selectSeller.click();
		// 		}
		// 	}
		// catch (error)
		// {
			// 	console.log("error");
			// }