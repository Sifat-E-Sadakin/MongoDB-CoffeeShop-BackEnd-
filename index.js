const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())

console.log(process.env.VITE_USER);

const uri = `mongodb+srv://${process.env.VITE_USER}:${process.env.VITE_PASS}@cluster0.rohhp7w.mongodb.net/?retryWrites=true&w=majority`;

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

    let coffeeDataBase = client.db('CoffeeBD').collection('Coffee');

    app.get('/coffee', async (req, res) => {
      let cursor = coffeeDataBase.find()
      let coffee = await cursor.toArray();
      res.send(coffee)
    })

    app.get('/coffee/:id', async (req, res) => {
      let id = req.params.id;
      let query = { _id: new ObjectId(id) }
      let result = await coffeeDataBase.findOne(query)
      res.send(result)
    })

    app.put('/coffee/:id', async (req, res) => {
      let id = req.params.id
      let coffee = req.body;
      let filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateCoffee = {
        $set: {
          name: coffee.name ,
        quantity: coffee.quantity ,
         supplier: coffee.supplier ,
         test: coffee.test ,
         category: coffee.category ,
         details: coffee.details ,
         photo: coffee.photo ,
         price: coffee.price
        },
      
      
      }

    let result = await coffeeDataBase.updateOne(filter, updateCoffee, options)
    res.send(result)

    })

    app.delete('/coffee/:id', async (req, res) => {
      let id = req.params.id;
      let query = { _id: new ObjectId(id) }
      let result = await coffeeDataBase.deleteOne(query);
      res.send(result);
    })

    app.post('/coffee', async (req, res) => {
      let coffee = req.body
      let NewCoffee = coffee;
      let result = await coffeeDataBase.insertOne(NewCoffee)

      res.send(result);
    })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})