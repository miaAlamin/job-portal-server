
require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())









const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5g0sa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
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

    const jobsCollection = client.db('job-portal').collection('jobs')
    const ApplicationsjobsCollection = client.db('job-portal').collection('jobs_protal')


    app.get('/jobs', async (req, res)=>{

      const email = req.query.email;
      let query = {}
      if(email){
        query = {hr_email: email}
      }
        const cursor = jobsCollection.find(query)
        const result = await cursor.toArray()
        res.send(result)

    })
    app.get('/jobs/:id', async (req, res)=>{
        const id = req.params.id;
        const user = {_id: new ObjectId(id)}
        const result = await jobsCollection.findOne(user)
        res.send(result)
    })
    app.get('/job-application', async (req, res)=>{
        const email = req.query.email;
        const query = {applecate_email: email}
        const result = await ApplicationsjobsCollection.find(query).toArray()
        res.send(result)
    })
    app.post('/job-applications', async (req, res)=>{
        const application = req.body;
        const result = await ApplicationsjobsCollection.insertOne(application)
        res.send(result)

    })
    app.post('/jobs',async (req, res)=>{
      const newjob = req.body;
      const result = await jobsCollection.insertOne(newjob)
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


app.get('/', (req, res)=>{
    res.send('job portal server is runing')
})

app.listen(port, ()=>{
    console.log(`job portal server is runing port: ${port}`)


})