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
mongoose.connect(MONGODB_URI).then(() => {
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

//Define callData Schema
const Schema = mongoose.Schema;
CallDataPostSchema = new Schema({
    call_reference: String,
    clientId: String,
    call_start: Number,
    call_end: Number,
    pilot_number: String,
    pg_number: String,
    agent_number: String,
    waiting_time: Number,
    call_reason: String,
    first_call_resolution: String,
    talk_time: Number,
    call_type: String,
    note: String,
    number: String,
});


// Define Clients model
ClientsPost = mongoose.model('ClientsPost', ClientsPostSchema, 'clients');
// Define callData model
CallDataPost = mongoose.model('CallDataPost', CallDataPostSchema, 'calls');

// Web service find caller data by calling number
app.post('/api/findClientByTelNumber', (req, res) => {
    console.log("/api/findClientByTelNumber");
    console.log("Find client data by calling number");
    var callingNumber = req.body.callingNumber;
    console.log("callingNumber = " + callingNumber);
    ClientsPost.findOne({ phoneNumber: callingNumber })
        .then((data) => {
            if (data != null) {
                console.log("First name: " + data.firstName);
                console.log("Last name: " + data.lastName);
                console.log("Email: " + data.email);
            }
            else {
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

app.post('/api/geoPosition', function (req, res) {
    var longitude = req.body.longitude;
    var latitude = req.body.latitude;
    var userName = req.body.userName;
    var userId = req.body.userId; 
    
    console.log("Post /api/geoPosition");
    console.log("longitude" + longitude);
    console.log("latitude" + latitude);
    console.log("userName" + userName);
     console.log("userId" + userId);
    const geoLocation = {
        longitude: longitude,
        latitude: latitude,
        userName: userName,
        userId: userId
    }
    //insertClient(client);
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
            console.log('Saved new client in client collection');
        }
    });
}

app.post('/api/saveCallData', function (req, res) {
    console.log("Post /api/saveCallData");
    var call_reference = req.body.call_reference;
    var clientId = req.body.clientId;
    var call_start = req.body.call_start;
    var call_end = req.body.call_end;
    var pilot_number = req.body.pilot_number;
    var pg_number = req.body.pg_number;
    var agent_number = req.body.agent_number;
    var waiting_time = req.body.waiting_time;
    var call_reason = req.body.call_reason;
    var first_call_resolution = req.body.first_call_resolution;
    var talk_time = req.body.talk_time;
    var call_type = req.body.call_type;
    var note = req.body.note;
    var number = req.body.number;

    const callData = {
        call_reference: call_reference,
        clientId: clientId,
        call_start: call_start,
        call_end: call_end,
        pilot_number: pilot_number,
        pg_number: pg_number,
        agent_number: agent_number,
        waiting_time: waiting_time,
        call_reason: call_reason,
        first_call_resolution: first_call_resolution,
        talk_time: talk_time,
        call_type: call_type,
        note: note,
        number: number
    }
    InsertNewCallData(callData);
    res.end("OK");


});
async function InsertNewCallData(callData) {
    //This function will insert new callData in collection "calls" 
    console.log("FUNCTION: InsertNewCallData(callData)");
    //make instance of callback
    const callDataPost = new CallDataPost(callData);
    console.log('Trying to save new CallData in collection calls');
    callDataPost.save((error) => {
        if (error) {
            console.log('Error happend when tried to save CallData in collection calls. Error: ' + error);
        }
        else {
            console.log('Saved CallData in collection calls');
        }
    });
}

app.get('/api/calls', (req, res) => {
    console.log("/api/calls");
    console.log("Get information about calls");
    var startTime = req.query.startTime;
    var endTime = req.query.endTime;
    var agent_number = req.query.agent_number;
    var pg_number = req.query.pg_number;
    var call_type = req.query.call_type;
    //ONLY AGENT
    if (agent_number != "all" && pg_number === "all" && call_type === "all") {
        CallDataPost.find({ $and: [{ call_start: { $gte: parseInt(startTime) } }, { call_end: { $lte: parseInt(endTime) } }, { agent_number: agent_number }] })
            .then((data) => {
                if (data != null) {
                    console.log(data.length + " call(s) found");
                }
                else {
                    console.log("No calls found");
                }
                res.json(data);
            })
            .catch((error) => {
                console.log('error', error);
            });
    }
    //ONLY CALL Type
    else if (agent_number === "all" && pg_number === "all" && call_type != "all") {
        CallDataPost.find({ $and: [{ call_start: { $gte: parseInt(startTime) } }, { call_end: { $lte: parseInt(endTime) } }, { call_type: call_type }] })

            .then((data) => {
                if (data != null) {
                    console.log(data.length + " call(s) found");
                }
                else {
                    console.log("No calls found");
                }
                res.json(data);
            })
            .catch((error) => {
                console.log('error', error);
            });

    }
    //AGENT anf PG
    else if (agent_number != "all" && pg_number != "all" && call_type === "all") {
        CallDataPost.find({ $and: [{ call_start: { $gte: parseInt(startTime) } }, { call_end: { $lte: parseInt(endTime) } }, { agent_number: agent_number }, { pg_number: pg_number }] })
        .then((data) => {
            if (data != null) {
                console.log(data.length + " call(s) found");
            }
            else {
                console.log("No calls found");
            }
            res.json(data);
        })
        .catch((error) => {
            console.log('error', error);
        });
    }

    //AGENT, PG, CALL type
    else if (agent_number != "all" && pg_number != "all" && call_type != "all") {
        CallDataPost.find({ $and: [{ call_start: { $gte: parseInt(startTime) } }, { call_end: { $lte: parseInt(endTime) } }, { agent_number: agent_number }, { pg_number: pg_number }, { call_type: call_type }] })

        .then((data) => {
            if (data != null) {
                console.log(data.length + " call(s) found");
            }
            else {
                console.log("No calls found");
            }
            res.json(data);
        })
        .catch((error) => {
            console.log('error', error);
        });

    }

    //PG and CALL Type
    else if (agent_number === "all" && pg_number != "all" && call_type != "all") {
        CallDataPost.find({ $and: [{ call_start: { $gte: parseInt(startTime) } }, { call_end: { $lte: parseInt(endTime) } }, { pg_number: pg_number }, { call_type: call_type }] })

        .then((data) => {
            if (data != null) {
                console.log(data.length + " call(s) found");
            }
            else {
                console.log("No calls found");
            }
            res.json(data);
        })
        .catch((error) => {
            console.log('error', error);
        });

    }

    //ALL Calls
    else if (agent_number === "all" && pg_number === "all" && call_type === "all") {
        CallDataPost.find({ $and: [{ call_start: { $gte: parseInt(startTime) } }, { call_end: { $lte: parseInt(endTime) } }] })

        .then((data) => {
            if (data != null) {
                console.log(data.length + " call(s) found");
            }
            else {
                console.log("No calls found");
            }
            res.json(data);
        })
        .catch((error) => {
            console.log('error', error);
        });

    }
    // ONLY PG Number
    else if (agent_number === "all" && pg_number != "all" && call_type === "all") {
        CallDataPost.find({ $and: [{ call_start: { $gte: parseInt(startTime) } }, { call_end: { $lte: parseInt(endTime) } }, { pg_number: pg_number }] })


        .then((data) => {
            if (data != null) {
                console.log(data.length + " call(s) found");
            }
            else {
                console.log("No calls found");
            }
            res.json(data);
        })
        .catch((error) => {
            console.log('error', error);
        });

    }
    


});
