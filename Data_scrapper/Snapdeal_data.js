const cheerio = require("cheerio");
const axios = require("axios");

async function Scrape_Snapdeal(SNAPDEAL) {
  try {
    const response = await axios.get(SNAPDEAL);
    const $ = cheerio.load(response.data);
    // -----------------------------------------
    const snapdeal_Products = [];
    // -----------------------------------------
    //? Loop through each product element and extract the data...
    $("div.col-xs-6.favDp.product-tuple-listing.js-tuple").each(
      (index, element) => {
        // -----------------------------------------
        if (index < 25) {
          const product = {};
          // -----------------------------------------
          //? Extract the product name...

          product.title = $(element).find("p.product-title").text();
          // -----------------------------------------
          // //? Extract the product price...
          product.price = $(element)
            .find("span.lfloat.product-desc-price.strike")
            .text()
            .trim();

          // -----------------------------------------
          // //? Extract the product image URL...
          product.image = $(element).find("img.product-image").attr("src");
          // -----------------------------------------
          // //? Extract the product ratings and reviews...
          product.rating_count = $(element)
            .find("p.product-rating-count")
            .text();
          // -----------------------------------------
          // //? Extract the product finalPriceWithOffer...
          product.finalPriceWithOffer = $(element)
            .find("span.lfloat.product-price")
            .text();
          // -----------------------------------------
          //? Push the product object into the products array...
          if (
            product.title !== "" &&
            product.price !== "" &&
            product.image !== "" &&
            product.image !== undefined &&
            product.rating_count !== "" &&
            product.finalPriceWithOffer !== ""
          ) {
            snapdeal_Products.push(product);
          }
          // -----------------------------------------
        }
      }
    );
    return snapdeal_Products;
    // console.log(snapdeal_Products);
  } catch (error) {
    // console.log(error);
    return error;
  }
}

module.exports = { Scrape_Snapdeal };
