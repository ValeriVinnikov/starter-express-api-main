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

//Connect to MongoDb
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

// Web service find caller data by calling number
app.post('/api/findClientByTelNumber', (req, res) => {
    console.log("/api/findClientByTelNumber");
    console.log("Find client data by calling number");
    var callingNumber = req.body.callingNumber;
    console.log("callingNumber = " + callingNumber);
    ClientsPost.findOne({ phoneNumber: callingNumber })
        .then((data) => {
            if (data != null)
            {
                console.log("First name: " + data.firstName);
                console.log("Last name: " + data.lastName);
                console.log("Email: " + data.email);
            }
            else
            {
                console.log("Not found");
            }            
            res.json(data);
        })
        .catch((error) => {
            console.log('error', error);
        });
});

app.post('/api/insertClient', function (req, res) {
    console.log("Post /api/insertClient");
    var phoneNumber = req.body.phoneNumber;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var clientId = req.body.clientId;
    var email = req.body.email;
    var country = req.body.country;
    var postCode = req.body.postCode;
    var city = req.body.city;
    var street = req.body.street;
    var birthday = req.body.birthday;
    var gender = req.body.gender;

    const client = {
        phoneNumber: phoneNumber,
        firstName: firstName,
        lastName: lastName,
        clientId: clientId,
        email: email,
        country: country,
        postCode: postCode,
        city: city,
        street: street,
        birthday: birthday,
        gender: gender
    }
    insertClient(client);
    res.end("OK");
});

async function insertClient(client) {
    //This function will insert client in collection "clients" 
    console.log("FUNCTION: insertClient(client)");
    //Output values of termin properties in console for debugging
    console.log("client.clientId = " + client.clientId);
    console.log("client.firstName = " + client.firstName);
    console.log("client.lastName = " + client.lastName);
    //make instance of client
    const newClientsPost = new ClientsPost(client);
    console.log('Trying to insert new client in clients collection');
    newClientsPost.save((error) => {
        if (error) {
            console.log('Error happend when tried to save client in clients collection. Error: ' + error);
        }
        else {
            console.log('Saved new client in client collection of Atlas DB');
        }
    });
}
