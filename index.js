const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;

// usr Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9m7cjb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        app.get("/", (req, res) => {
            res.send("Kabbo toys is running")
        })
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();
        const toysCollection = await client.db("toyDb").collection("allToys");

        // get All toys
        app.get("/allToys", async (req, res) => {
            const result = await toysCollection.find().toArray();
            res.send(result);
        })
        // get my toys
        app.get("/myToys", async (req, res) => {
            const query = { sellerEmail: req.query.email };
            const result = await toysCollection.find(query).toArray();
            res.send(result);
        })

        // get data for update
        app.get("/update/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query);
            res.send(result);
        })
        // get data for details
        app.get("/myToy/details/:id", async (req,res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query);
            res.send(result);
        })

        // update route with id
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const updatedInfo = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    toyName: updatedInfo.toyName,
                    toyPhoto: updatedInfo.toyPhoto,
                    toyPrice: updatedInfo.toyPrice,
                    toyRating: updatedInfo.toyRating,
                    toyQuantity: updatedInfo.toyQuantity,
                    toyCategory: updatedInfo.toyCategory,
                    toyDescription: updatedInfo.toyDescription,
                },
            }
            console.log(filter, options, updateDoc);
            const result = await toysCollection.updateOne(filter, updateDoc,options);
            res.send(result);
        })


        // insert toy
        app.post("/addToy", async (req, res) => {
            const toyInfo = req.body;
            const result = await toysCollection.insertOne(toyInfo);
            res.send(result)
        })


        // delete a toy

        app.delete("/delete/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.deleteOne(query);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Kabbo toys is listening on ${port}`);
})
