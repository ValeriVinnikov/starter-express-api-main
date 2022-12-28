const express = require('express')
const mongoose = require('mongoose'); //Package used to work with MongoDB Atlas database
//const bodyParser = require('body-parser') //Package used to work with web service body

const app = express()
app.use(express.json())

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.listen(process.env.PORT || 3000)

//Define URL for MongoDB
const MONGODB_URI = 'mongodb+srv://dbuser:$Rainbow1@cluster0.ooeal.mongodb.net/<dbname>?retryWrites=true&w=majority'

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI).then(()=>
{
    console.log('MongoDB is connected!!!!')
})


//Define clients Schema
const ClientsSchema = mongoose.Schema;
ClientsPostSchema = new ClientsSchema({
    phoneNumber: String,
    firstName: String,
    lastName: String,
    clientId: String,
    email: String,
    country: String,
    postCode: String,
    city: String,
    street: String,
    birthday: String,
    gender: String,
    country: String
});

// Define Clients model
ClientsPost = mongoose.model('ClientsPost', ClientsPostSchema, 'clients');

// Web service find document by caller
app.post('/api/findClientByTelNumber', (req, res) => {
    console.log("/api/findClientByTelNumber");
    console.log("Find client by calling number");
    var callingNumber = req.body.callingNumber;
    console.log("callingNumber = " + callingNumber);
    ClientsPost.findOne({ phoneNumber: callingNumber })
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.log('error', error);
        });
});