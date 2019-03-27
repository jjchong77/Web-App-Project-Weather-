// Set up server
var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + "/../front-end"));

//Database
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://test_user:password1234@cluster0-grpgd.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });

//Jquery
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

//---------------------------------------------------------------------------
//Index HTML
app.get ('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/../front-end/index.html'));
});

app.post ('/', function(request, response) {
    
});

app.listen(app.get('port'), function() {    
    console.log('Server listening on port ' + app.get('port')); 
});



function calClothing(location, comfortTemp, rangeTemp, docs) {
    var top = [];
    var bot = [];
    var acc = [];

    $.each(docs, function(index, element) {
        if (element.type == 'top') {
            top.push(element)
        }

        if (element.type == 'bot') {
            bot.push(element)
        }

        if (element.type == 'accessory') {
            acc.push(element)
        }
    });

    $.get("https://api.apixu.com/v1/forecast.json?key=03ab689a2dc0497d86e214654191303&q=" + city, function(data){
        //console.log(data)
        var minTemp = comfortTemp - rangeTemp;
        var maxTemp = comfortTemp + rangeTemp;

        //Send a message to the client 
        ws.send(location + "#" + comfortTemp + "#" + rangeTemp);
    });
}

//Connect to Database
client.connect(err => {
    const collection = client.db("weather").collection("items");
    collection.find().toArray(function (err, docs) {
        console.log(docs);
    });
    client.close();
});
