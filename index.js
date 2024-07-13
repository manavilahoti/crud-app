const express = require('express') //imports express 
const app = express() //this calls the express function which creates an instance of express application
const mongoose = require('mongoose');

//MongoDB URI
const dbURI = 'mongodb://localhost:27017';

app.listen(3000,()  => {
    console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
    res.send("Hello from node API Server");
});

//connect to db 
mongoose.connect(dbURI)
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