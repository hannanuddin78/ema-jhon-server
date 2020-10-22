const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ugsfy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const productCollection = client.db("emaJhonDb").collection("products");
  const orderCollection = client.db("emaJhonDb").collection("orders");

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  app.get("/products", (req, res) => {
    productCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/product/:key", (req, res) => {
    productCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.post("/reviewProductByKeys", (req, res) => {
    const reviewProducts = req.body;
    productCollection
      .find({ key: { $in: reviewProducts } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/orderDetails", (req, res) => {
    const orders = req.body;
    orderCollection.insertOne(orders).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("done work");
});

app.listen(port);
