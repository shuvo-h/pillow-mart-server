const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
var cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middlewear 
app.use(cors());
app.use(express.json());

// MongoDb connecting uri 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uc5dq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// API function 
async function run(){
    try{
        await client.connect();
        const database = client.db("pillowMart");
        const productsCollection = database.collection("allProducts");
        const ordersCollection = database.collection("orderList");
        const usersCollection = database.collection("allUser");
        const reviewCollection = database.collection("reviews");
        const upCommingProductsCollection = database.collection("upCommingProducts");

        // ************************************************ //
        // Product collection API 
        // GET API (get all products)
        app.get('/products',async(req,res)=>{
            const query = {};
            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            res.json(result);
        })

        // GET API (get single product by id)
        app.get("/products/:id",async(req,res)=>{
            const {id}= req.params;
            const query = {_id: ObjectId(id)}
            const result = await productsCollection.findOne(query);
            res.json(result)
        })

        // POST API (insert a single product)
        app.post("/products",async(req,res)=>{
            const productInfo = req.body;
            const result = await productsCollection.insertOne(productInfo);
            res.json(result);
        })

        // DELETE API (delete a product by ID)
        app.delete('/products/:productId',async(req,res)=>{
            const {productId} = req.params;
            const query = {_id: ObjectId(productId)}
            const result = await productsCollection.deleteOne(query)
            res.json(result)
        })

        // ************************************************ //
        // Order List collection API 
        // POST API (insert a single order)
        app.post("/orders",async(req,res)=>{
            const orderInfo = req.body;
            const result = await ordersCollection.insertOne(orderInfo);
            res.json(result);
        })
        
        // GET API (get all orders)
        app.get('/orders',async(req,res)=>{
            const query = {};
            const cursor = ordersCollection.find(query);
            const result = await cursor.toArray();
            res.json(result);
        })
        
        // Get API (get a single order by ID)
        app.get("/orders/:orderId",async(req,res)=>{
            const {orderId} = req.params;
            const query = {_id: ObjectId(orderId)}
            const result = await ordersCollection.findOne(query);
            res.json(result)
        })

        // --------------------------------
        // app.
        // GET API (get all orders by email query)
        app.get("/ordersList",async(req,res)=>{
            const queryMail = req.query.email;
            if (queryMail) {
                const query = { customerEmail: queryMail}
                const cursor = ordersCollection.find(query);
                const result = await cursor.toArray();
                res.json(result);
            }else{
                res.json([])
            }
        })
        // --------------------------------

        // DELETE API (delete an order by ID)
        app.delete('/orders/:orderId',async(req,res)=>{
            const {orderId} = req.params;
            const query = {_id: ObjectId(orderId)}
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        })

        // PUT API (update an order info )
        app.put("/orders/:existId", async(req,res)=>{
            const {existId} = req.params;
            const newStatus = req.body;
            const filter = {_id: ObjectId(existId)}
            const options = {upsert: true}
            const updateDoc = { $set: newStatus}
            const result = await ordersCollection.updateOne(filter,updateDoc,options);
            res.json(result)
        })

        // ************************************************ //
        // User information API 
        //GET API (get a single user by email query)
        app.get('/users',async(req,res)=>{
            const queryMail = req.query.existEmail;
            const query = {email: queryMail}
            const searchedMail = await usersCollection.findOne(query) || {}
            res.json(searchedMail)
        })
        // POST API (insert a single user)
        app.post("/users",async(req,res)=>{
            const userInfo = req.body;
            const result = await usersCollection.insertOne(userInfo);
            res.json(result);
        })
        // PUT API (update a single user info )
        app.put("/users/:existId", async(req,res)=>{
            const {existId} = req.params;
            const adminRole = req.body;
            const filter = {_id: ObjectId(existId)}
            const options = {upsert: true}
            const updateDoc = { $set: adminRole}
            const result = await usersCollection.updateOne(filter,updateDoc,options);
            res.json(result)
        })
        // ************************************************ //
        // Admin information API 

        // ************************************************ //
        // Review related API
        //GET API (get all reviews list)
        app.get("/reviews", async(req,res)=>{
            const query = {}
            const cursor = reviewCollection.find(query);
            const allReviews = await cursor.toArray();
            res.json(allReviews);
        })

         // GET API (get user based reviews by email query)
         app.get("/reviews/userReview",async(req,res)=>{
            const queryMail = req.query.reviewerEmail;
            const query = { revEmail: queryMail}
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.json(result);
        })
        
        // POST API (insert a single review)
        app.post("/reviews",async(req,res)=>{
            const reviewInfo = req.body;
            const result = await reviewCollection.insertOne(reviewInfo);
            res.json(result);
        })
        // DELETE API (delete a review by ID)
        app.delete('/reviews/:revId',async(req,res)=>{
            const {revId} = req.params;
            const query = {_id: ObjectId(revId)}
            const result = await reviewCollection.deleteOne(query)
            res.json(result)
        })

        // Upcomming Products
        //GET API (get all upcomming products)
        app.get('/upcommingProducts', async(req,res)=>{
            const query = {}
            const cursor = upCommingProductsCollection.find(query);
            const upcommingProducts = await cursor.toArray();
            res.json(upcommingProducts);
        })

    }finally{
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server running at ${port}`)
})