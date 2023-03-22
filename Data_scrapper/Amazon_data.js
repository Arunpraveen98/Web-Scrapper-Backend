const cheerio = require("cheerio");
const axios = require("axios");

async function Scrape_Amazon(AMAZON) {
  // -----------------------------------------
  try {
    // console.log(AMAZON);
    // -----------------------------------------
    const response = await axios.get(AMAZON, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 5.1; AFTS Build/LMY47O) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/41.99900.2250.0242 Safari/537.36",
      },
    });
    // -----------------------------------------
    const $ = cheerio.load(response.data);
    // -----------------------------------------
    const Amazon_Products = [];
    // -----------------------------------------
    $("div[data-component-type='s-search-result']").each((index, element) => {
      if (index < 50) {
        const product = {};
        // -----------------------------------------
        product.title = $(element)
          .find("h2.a-size-mini.a-spacing-none.a-color-base.s-line-clamp-2")
          .text();
        // -----------------------------------------
        product.value = ["nokia", "noki", "nokia mobiles"];
        // -----------------------------------------
        product.price = $(element).find("span.a-price-whole").first().text();
        // -----------------------------------------
        product.image = $(element).find("img.s-image").attr("src");
        // -----------------------------------------
        product.rating_count = $(element)
          .find("span.a-size-base")
          .first()
          .text();
        // -----------------------------------------
        if (
          product.title !== "" &&
          product.title !== undefined &&
          product.image !== undefined &&
          product.image !== "" &&
          product.price !== ""
        ) {
          Amazon_Products.push(product);
        }
      }
    });
    // -----------------------------------------
    return Amazon_Products;
  } catch (error) {
    // console.log(error);
    return error;
  }
}

module.exports = { Scrape_Amazon };
