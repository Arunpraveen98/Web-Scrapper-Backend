const cheerio = require("cheerio");
const axios = require("axios");

async function Scrape_Flipkart(FLIPKART) {
  try {
    // console.log(FLIPKART);
    const response = await axios.get(FLIPKART);
    const $ = cheerio.load(response.data);
    // -----------------------------------------
    const Flipkart_Products = [];
    // -----------------------------------------
    //? Loop through each product element and extract the data...
    $("div._2kHMtA").each((index, element) => {
      // -----------------------------------------
      if (index < 25) {
        const product = {};
        // -----------------------------------------
        //? Extract the product name...
        product.title = $(element).find("div._4rR01T").text();
        // -----------------------------------------
        //? Extract the product price...
        product.finalPriceWithOffer = $(element)
          .find("div._30jeq3._1_WHN1")
          .text();
        // -----------------------------------------
        //? Extract the product image URL...
        product.image = $(element).find("img._396cs4").attr("src");
        // -----------------------------------------
        //? Extract the product ratings and reviews...
        product.rating_star = $(element).find("div._3LWZlK").text();
        product.rating_and_review = $(element).find("span._2_R_DZ").text();
        // -----------------------------------------
        //? Extract the product finalPriceWithOffer...
        product.price = $(element).find("div._3I9_wc._27UcVY").text();
        // -----------------------------------------
        //? Extract the product specificationa
        product.specifications = $(element).find("li.rgWa7D").text();
        // -----------------------------------------
        //? Push the product object into the products array...
        if (
          product.title !== "" &&
          product.finalPriceWithOffer !== "" &&
          product.image !== "" &&
          product.image !== undefined &&
          product.rating_star !== "" &&
          product.rating_and_review !== "" &&
          product.price !== "" &&
          product.specifications !== ""
        ) {
          Flipkart_Products.push(product);
        }

        // -----------------------------------------
      }
    });
    // console.log(Flipkart_Products);
    return Flipkart_Products;
  } catch (error) {
    // console.log(error);
    return error;
  }
}

module.exports = { Scrape_Flipkart };
