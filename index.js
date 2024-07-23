const express = require('express') //imports express 
const bodyParser = require('body-parser')

const app = express() //this calls the express function which creates an instance of express application
const Product = require('./models/productmodel.js');//imports product model from a separate file
app.use(bodyParser.json());//middleware to parse JSON bodies
const mongoose = require('mongoose');//imports mongoose from MongoDB interactions

//MongoDB URI
const dbURI = 'mongodb://localhost:27017'; //URI for MongoDB connection

//starting the server
app.listen(3000,()  => {
    console.log('Server is running on port 3000');
});


//Root route; HTTP Method: GET; Endpoint: '/'
app.get('/', (req, res) => {
    res.send("Hello from node API Server");
});

//handles asynchronous operations using async and await
app.get('/api/products', async (req, res) => {
    try{
        const products = await Product.find({}); //to fetch all products from the database
        res.status(200).json(products);//if successful, sends a JSON response with the product data and a status code of 200(OK)
    }

    catch(error){
        res.status(500).json({message: error.message});
    }
});

app.get('/api/product/:id', async(req, res) => {
    try{
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    }
    catch(err){
        res.status(500).json({message: error.message});
    }
});

app.post('/api/products', async(req,res) =>{
    try{
        const product = await Product.create(req.body);
        res.status(200).json(product);
    }

    catch(error){
        res.status(500).json({message: error.message});
    }
});

//update a product

app.put('/api/product/:id', async(req,res) => {
    try{
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if(!product){
            return res.status(404).json({message: "Product not found"});

        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});

//delete a product
app.delete('/api/product/:id', async(req,res) =>{
    try{
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }
        res.status(200).json({message: "Product Deleted Successfully"});
    }

    catch(error){
        res.status(500).json({message: error.message});
    }
});


//connect to db 
mongoose.connect(dbURI,{
    dbName: "crud"
  })
.then(() =>{
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB: ', error.message);

    //Handle specific errors
    if(error.name === 'MongoNetworkError'){
        console.error('network error occured');
    }
    else if(error.name === 'MongooseServerSelectionError'){
        console.error('Server selection error');
    }
    else{
        console.error('An unexpected error occured', error);
    }
});


//event handling for successful connection
mongoose.connection.on('connected', () =>{
    console.log('Connected successfully to ' + dbURI);
});

//event handling for connection error
mongoose.connection.on('error', (err) =>{
    console.error('Mongoose connection error ' + err);
});

//event handling ehen connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

//Closing connection
process.on('SIGINT', () =>{
    mongoose.connection.close(() => {
        console.log('Mongoose connection is disconnected due to application termination');
        process.exit(0);
    });
});