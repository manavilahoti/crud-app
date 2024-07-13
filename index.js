const express = require('express') //imports express 
const bodyParser = require('body-parser')
const app = express() //this calls the express function which creates an instance of express application
const Product = require('./models/productmodel.js');
app.use(bodyParser.json());
const mongoose = require('mongoose');

//MongoDB URI
const dbURI = 'mongodb://localhost:27017';

app.listen(3000,()  => {
    console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
    res.send("Hello from node API Server");
});

app.get('/api/products', async (req, res) => {
    try{
        const products = await Product.find({});
        res.status(200).json(products);
    }

    catch(error){
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