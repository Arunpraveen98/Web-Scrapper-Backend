//? express package...
const express = require("express");
const app = express();
app.use(express.json());
// -----------------------------------------
//? cors package...
const cors = require("cors");
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
// -----------------------------------------
const dotenv = require("dotenv").config();
// -----------------------------------------
//? PORT NUMBER...
const PORT = process.env.PORT || 8000;
// -----------------------------------------
//? MONGODB package...
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const URL = process.env.MONGO_DB_URL;
// --------------------------------------------------------------------------------------------
//? custom packages...
const { Scrape_Snapdeal } = require("./Data_scrapper/Snapdeal_data");

const { Scrape_Amazon } = require("./Data_scrapper/Amazon_data");

const { Scrape_Flipkart } = require("./Data_scrapper/Flipkart_data");
// ---------------------------------------------------------------------------------------

//? POST_FLIPKART_DATA ...
app.post("/Flipkart_Products", async (req, res) => {
  try {
    const query_value = req.query.name;
    // console.log(query_value);
    const products_details = await Scrape_Flipkart(
      `https://www.flipkart.com/search?q=${query_value}`
    );
    const Insert_Flipkart_data = products_details.slice(0, 10);
    // console.log(Insert_Flipkart_data);

    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(URL);
    //--------------------------------------
    //? 2) Select Database.
    const db = connection.db("FLIPKART");
    //--------------------------------------
    //? 3) Select Collection.
    const collection = db.collection("Flipkart_Products");
    //--------------------------------------
    //? 4) Do Operations :-
    const Flipkart_Products_Data = await collection.insertMany(
      Insert_Flipkart_data
    );
    //--------------------------------------
    //? 5) Finally Close the Connection...
    await connection.close();
    // --------------------------------------

    res.json({ message: "Successfully Flipkart Products Data is Inserted..." });
  } catch (error) {
    res.json({ message: error.message });
    console.log(error);
  }
});
// -----------------------------------------
//? POST_AMAZON_DATA ...
app.post("/Amazon_Products", async (req, res) => {
  try {
    const query_value = req.query.name;
    // console.log(query_value);

    const products_details = await Scrape_Amazon(
      `https://www.amazon.com/s?k=${query_value}&i=mobile`
    );
    const Insert_Amazon_data = products_details.slice(0, 10);
    // console.log(Insert_Amazon_data);

    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(URL);
    //--------------------------------------
    //? 2) Select Database.
    const db = connection.db("AMAZON");
    //--------------------------------------
    //? 3) Select Collection.
    const collection = db.collection("Amazon_Products");
    //--------------------------------------
    //? 4) Do Operations :-

    const Amazon_Products_Data = await collection.insertMany(
      Insert_Amazon_data
    );
    //--------------------------------------
    //? 5) Finally Close the Connection...
    await connection.close();
    // --------------------------------------

    res.json({ message: "Successfully Amazon Products Data is Inserted..." });
  } catch (error) {
    res.json({ message: error.message });
    console.log(error);
  }
});
// -----------------------------------------
//? POST_SNAPDEAL_DATA ...
app.post("/Snapdeal_Products", async (req, res) => {
  try {
    const query_value = req.query.name;
    // console.log(query_value);
    const products_details = await Scrape_Snapdeal(
      `https://www.snapdeal.com/search?keyword=${query_value}&sort=rlvncy`
    );
    const Insert_Snapdeal_Products = products_details.slice(0, 10);
    // console.log(Insert_Snapdeal_Products);

    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(URL);
    //--------------------------------------
    //? 2) Select Database.
    const db = connection.db("SNAPDEAL");
    //--------------------------------------
    //? 3) Select Collection.
    const collection = db.collection("Snapdeal_Products");
    //--------------------------------------
    //? 4) Do Operations :-
    const Snapdeal_Products_Data = await collection.insertMany(
      Insert_Snapdeal_Products
    );
    //--------------------------------------
    //? 5) Finally Close the Connection...
    await connection.close();
    // --------------------------------------

    res.json({ message: "Successfully Snapdeal Products Data is Inserted..." });
  } catch (error) {
    res.json({ message: error.message });
    console.log(error);
  }
});
// -----------------------------------------
//? GET_FLIPKART_DATA ...
app.get("/Flipkart_Products_List", async (req, res) => {
  try {
    const query_value = req.query.name;
    // console.log(query_value);
    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(URL);
    //--------------------------------------
    //? 2) Select Database.
    const db = connection.db("FLIPKART");
    //--------------------------------------
    //? 3) Select Collection.
    const collection = db.collection("Flipkart_Products");
    //--------------------------------------
    //? 4) Do Operations :-
    if (query_value) {
      const Flipkart_Products_Lists = await collection
        .find({ value: { $in: [`${query_value}`] } })
        .toArray();
      //? 5) Finally Close the Connection...
      await connection.close();
      res.json(Flipkart_Products_Lists);
    }
    if (query_value == "" || query_value == undefined) {
      const Flipkart_Products_Lists = await collection.find({}).toArray();
      //? 5) Finally Close the Connection...
      await connection.close();
      res.json(Flipkart_Products_Lists);
    }
    //--------------------------------------
  } catch (error) {
    res.json({ message: error.message });
    console.log(error);
  }
});
// -----------------------------------------
//? GET_SNAPDEAL_DATA ...
app.get("/Snapdeal_Products_List", async (req, res) => {
  try {
    const query_value = req.query.name;
    // console.log(query_value);
    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(URL);
    //--------------------------------------
    //? 2) Select Database.
    const db = connection.db("SNAPDEAL");
    //--------------------------------------
    //? 3) Select Collection.
    const collection = db.collection("Snapdeal_Products");
    //--------------------------------------
    //? 4) Do Operations :-

    if (query_value) {
      const Snapdeal_Products_Lists = await collection
        .find({ value: { $in: [`${query_value}`] } })
        .toArray();
      //? 5) Finally Close the Connection...
      await connection.close();
      res.json(Snapdeal_Products_Lists);
    }
    if (query_value == "" || query_value == undefined) {
      const Snapdeal_Products_Lists = await collection.find({}).toArray();
      //? 5) Finally Close the Connection...
      await connection.close();
      res.json(Snapdeal_Products_Lists);
    }
    //--------------------------------------
  } catch (error) {
    res.json({ message: error.message });
    console.log(error);
  }
});
// -----------------------------------------
//? GET_AMAZON_DATA ...
app.get("/Amazon_Products_List", async (req, res) => {
  try {
    const query_value = req.query.name;
    // console.log(query_value);
    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(URL);
    //--------------------------------------
    //? 2) Select Database.
    const db = connection.db("AMAZON");
    //--------------------------------------
    //? 3) Select Collection.
    const collection = db.collection("Amazon_Products");
    //--------------------------------------
    //? 4) Do Operations :-
    if (query_value) {
      const Amazon_Products_Lists = await collection
        .find({ value: { $in: [`${query_value}`] } })
        .toArray();
      //? 5) Finally Close the Connection...
      await connection.close();
      res.json(Amazon_Products_Lists);
    }
    if (query_value == "" || query_value == undefined) {
      const Amazon_Products_Lists = await collection.find({}).toArray();
      //? 5) Finally Close the Connection...
      await connection.close();
      res.json(Amazon_Products_Lists);
    }
    // -----------------------------------------
  } catch (error) {
    res.json({ message: error.message });
    console.log(error);
  }
});
// -----------------------------------------
//? SERVER_PORT
app.listen(PORT, () =>
  console.log(`server is running in the PORT NO :- ${PORT}`)
);
// -----------------------------------------
