const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.jdmrnpn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const coffeesColection = client.db("coffeeStore").collection("coffeeColection");


    app.get("/coffees", async(req, res) => {
        const result = await coffeesColection.find().toArray()
        res.send(result)
    })

    app.get("/coffees/:id", async(req, res) =>{
      const coffeesId = req.params.id;
      const query = {_id: new ObjectId(coffeesId)}
      const result = await coffeesColection.findOne(query);
      res.send(result)
    })

    app.post("/coffees", async(req, res)=>{
        const coffeeInfo = req.body;
        const result = await coffeesColection.insertOne(coffeeInfo)
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", async(req, res) => {
    res.send("coffee server is running in 5000 port")
})

app.listen(port, ()=> {
    console.log("coffee server is running", port)
})