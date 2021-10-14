const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.33vow.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
client.connect((err) => {
    const eventCollection = client.db("smartShop").collection("events");
    const orderCollection = client.db("smartShop").collection("order");

    app.get("/events", (req, res) => {
        eventCollection.find({}).toArray((err, items) => {
            res.send(items);
        });
    });

    app.get("/event/:id", (req, res) => {
        eventCollection
            .find({ _id: ObjectId(req.params.id) })
            .toArray((err, items) => {
                res.send(items[0]);
            });
    });

    app.post("/addEvent", (req, res) => {
        const newEvent = req.body;
        eventCollection.insertOne(newEvent).then((result) => {
            console.log("inserted count", result.insertedCount);
            res.send(result.insertedCount > 0);
        });
    });

    app.post("/addOrder", (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order).then((result) => {
            console.log("inserted count", result.insertedCount);
            res.send(result.insertedCount > 0);
        });
    });

    // ai ta na hole pore kete dibo

    app.get("/productMange", (req, res) => {
        eventCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.delete("/deleteProduct/:id", (req, res) => {
        const id = ObjectID(req.params.id);
        console.log("delete this", id);
        productCollection
            .deleteOne({ _id: id })
            .then((documents) => res.send(!!documents.value));
    });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


