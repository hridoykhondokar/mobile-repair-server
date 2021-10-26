const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express()


app.use(bodyParser.json());
app.use(cors());


const port = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mvf4b.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const dataCollection = client.db("mobileRepair").collection("review");
  const userCollection = client.db("mobileRepair").collection("user");
  const adminCollection = client.db("mobileRepair").collection("admin");
  const planCollection = client.db("mobileRepair").collection("plan");
  console.log('dataCollection ok')

  app.post('/addReview', (req, res) => {
    const review = req.body;
    console.log(review)
    dataCollection.insertOne(review)
      .then(result => {
        res.send(result)
      })
  })


  app.get('/getReviews', (req, res) => {
    dataCollection.find({})
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.get('/getPlans', (req, res) => {
    planCollection.find({})
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.get('/getPlan/:_id', (req, res) => {
    planCollection.find({ _id: ObjectId(req.params._id) })
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.post('/userInfo', (req, res) => {
    const data = req.body;
    console.log(data)
    userCollection.insertOne(data)
      .then(result => {
        res.send(result)
      })
  })

  app.get('/plansDetails', (req, res) => {
    userCollection.find({})
      .toArray((err, document) => {
        res.send(document)
      })
  })


  app.get('/plansDetails/:email', (req, res) => {
    userCollection.find({ email: req.params.email })
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.post('/addAdmin', (req, res) => {
    const data = req.body;
    adminCollection.insertOne(data)
      .then(result => {
        res.send(result)
      })
  })

  app.get('/admin/:email', (req, res) => {
    adminCollection.find({ email: req.params.email })
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.patch('/updateStatus/:id', (req, res) => {
    userCollection.updateOne({ _id: ObjectId(req.params.id)},
      {
        $set: { status: req.body.status }
      })
      .then(result => {
        res.send(result.modifiedCount > 0)
      })
  })


});


app.get('/', (req, res) => {
  res.send("Welcome to db it's working")
})

app.listen(process.env.PORT || port)
