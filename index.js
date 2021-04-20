const express = require('express')
const objectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config();

console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.avdod.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()

app.use(bodyParser.json());
app.use(cors());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const port = process.env.PORT || 5000
client.connect(err => {
  const serviceCollection = client.db("agency").collection("services");
  const adminList = client.db("agency").collection("admin");
  const orderList = client.db("agency").collection("orders");
  const review = client.db("agency").collection("review")
  console.log("database connected");


  app.post('/addServices', (req, res) => {
    const newService = req.body;
    console.log(newService);
    serviceCollection.insertOne(newService)
      .then(result => {
        console.log('in', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/services', (req, res) => {
    serviceCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/orders', (req, res) => {
    orderList.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    console.log(newAdmin);
    adminList.insertOne(newAdmin)
      .then(result => {
        console.log('in', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/order/:id', (req, res) => {
    serviceCollection.find({ _id: objectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    console.log(newOrder);
    orderList.insertOne(newOrder)
      .then(result => {
        console.log('in', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  app.delete('/deleteService/:id', (req, res) => {
    const id = objectId(req.params.id);
    console.log('delete this', id);
    serviceCollection.findOneAndDelete({ _id: id })
      .then(documents => { res.send(documents) })
      .catch(err => console.log(err))
  })


  app.post('/addReview', (req, res) => {
    const newReview = {
      name: req.body.name,
      email: req.body.email,
      companyName: req.body.companyName,
      description: req.body.description,
      image: req.body.photoURL
    }
    console.log(newReview);
    review.insertOne(newReview)
      .then(result => {
        console.log('in', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })



  app.get('/review', (req, res) => {
    review.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminList.find({ email: email })
      .toArray((err, admin) => {
        res.send(admin.length > 0);
      })
  })


  app.get('/bookingList',(req, res)=>{
    orderList.find({email: req.query.email})
    .toArray((err, documents) => {
      res.status(200).send(documents)
    })
  })

});





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)