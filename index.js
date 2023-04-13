//? express package...
const express = require("express");
const app = express();
// ------------------
//? bcrypt => to secure Password...
const bcrypt = require("bcryptjs");
// ------------------
//? jwt => to verify user ...
const jwt = require("jsonwebtoken");
// ------------------
//? dotenv => to enable environment variables...
const dotenv = require("dotenv").config();
// ------------------
const mongodb = require("mongodb");
//? PORT NUMBER...
const PORT = process.env.PORT || 8000;
// -----------------------------------------
//? cors package...
const cors = require("cors");
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
// -----------------------------------------
//? MONGODB package...

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
//? STUDENT_REGISTRATION...

app.post("/User-Registration", async function (req, res) {
  try {
    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(URL);
    // ------------------
    //? 2) Select Database :-
    const db = connection.db("WEB-SCRAPPER_REGISTRATION");
    // ------------------
    //? 3) Select Collection :-
    const collection = db.collection("USERS_REGISTER");
    // ------------------
    //? 4) Do Operations :-
    const Get_Email = await collection.findOne({
      Email: req.body.Email,
    });
    // console.log(Get_Email);
    // ------------------
    //? Checking Email already exists or not ...
    if (Get_Email === null) {
      //? Generate salt random data...
      const salt = await bcrypt.genSalt(10);
      //? hash function to encrypt the password...
      const hash = await bcrypt.hash(req.body.Password, salt);
      req.body.Password = hash;
      req.body.ConfirmPassword = hash;
      const Register_Student = await collection.insertOne(req.body);
      // console.log(Register_Student);
      // ------------------
      //? 5) Finally Close the Connection...
      await connection.close();
      res.json({ message: "Successfully USER Registered..." });
      // ------------------
    } else {
      res.json({ message: "Email already exists", Email: req.body.Email });
      //? 5) Finally Close the Connection...
      await connection.close();
      // ------------------
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
// --------------------------------------------
//? STUDENT LOGIN ...
app.post("/User-Login", async function (req, res) {
  try {
    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(URL);
    // ------------------
    //? 2) Select Database :-
    const db = connection.db("WEB-SCRAPPER_REGISTRATION");
    // ------------------
    //? 3) Select Collection :-
    const collection = db.collection("USERS_REGISTER");
    // ------------------
    //? 4) Do Operations :-
    const Student_Login = await collection.findOne({ Email: req.body.Email });
    // ------------------
    //? If Email is there means then we have to compare the Password...
    if (Student_Login) {
      const Compare = await bcrypt.compare(
        req.body.Password,
        Student_Login.Password
      );
      // ------------------
      //? If Password true means then we have to Generate the jwt token...
      if (Compare) {
        const token = jwt.sign(
          { id: Student_Login._id },
          process.env.SECRET_KEY,
          {
            expiresIn: process.env.TOKEN_TIME_OUT,
          }
        );
        res.status(200).json({
          message: "Login Success",
          token,
          Student_Email: Student_Login.Email,
          Student_Name: `${Student_Login.FirstName} ${Student_Login.LastName}`,
        });
        //? 5) Finally Close the Connection...
        await connection.close();
        // ------------------
      } else {
        res.json({ message: "Invalid Email/Password..." });
        //? 5) Finally Close the Connection...
        await connection.close();
      }
      // ------------------
    } else {
      res.status(401).json({ message: "Please Signup and Login" });
      //? 5) Finally Close the Connection...
      await connection.close();
    }
    // ------------------
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
// --------------------------------------------
//? SERVER_PORT
app.listen(PORT, () =>
  console.log(`server is running in the PORT NO :- ${PORT}`)
);
// -----------------------------------------
