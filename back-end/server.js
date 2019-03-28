// Set up server
var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + "/../front-end"));

// Body Parser
var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
var db = [];

app.get ('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/../front-end/index.html'));
});

app.post ('/', function(request, response) {
    var loc = request.body.location;
    var temp = request.body.temperature;
    var range = request.body.range;

    calClothing(loc, temp, range);

    response.send("10");
});

//Connect to Database
client.connect(err => {
    const collection = client.db("weather").collection("items");
    collection.find().toArray(function (err, docs) {
        db = docs;
    });
    client.close();

    app.listen(app.get('port'), function() {    
        console.log('Server listening on port ' + app.get('port')); 
    });

});

function calClothing(location, comfortTemp, rangeTemp) {
    var top = [];
    var bot = [];
    var acc = {snowy: [], sunny: [], rain: [], default: []};

    var choosenTop = [];
    var choosenBot = [];
    var choosenAcc;

    $.each(db, function(index, element) {
        if (element.type == 'top') {
            top.push(element)
        }

        if (element.type == 'bot') {
            bot.push(element)
        }

        if (element.type == 'accessory') {
            switch(element.weather) {
                case 'snowy':
                    acc.snowy.push({name: element.name,
                                    heat: element.heat});
                    break;
                case 'sunny':
                    acc.sunny.push({name: element.name,
                                    heat: element.heat});
                    break;
                case 'rain':
                    acc.rain.push({name: element.name,
                                   heat: element.heat});
                    break;
                default:
                    acc.default.push({name: element.name,
                                      heat: element.heat});
                    break;
            }
        }
    });

    $.get("https://api.apixu.com/v1/forecast.json?key=03ab689a2dc0497d86e214654191303&q=" + location, function(data){
        //console.log(data.current.condition.code)
        var minTemp = comfortTemp - rangeTemp;
        var maxTemp = comfortTemp + rangeTemp;
        var condCode = data.current.condition.code
        var poss = [];

        if (condCode == 1000 && acc.sunny.length != 0) {

            choosenAcc = acc.sunny[getRandomInt(0, acc.sunny.length)];

        } else if (condCode == 1063 || condCode == 1072 || (condCode >= 1150 && condCode <= 1201) || (condCode >= 1240 && condCode <= 1246) || (condCode >= 1273 && condCode <= 1282) && acc.rain.length != 0) {

            choosenAcc = acc.rain[getRandomInt(0, acc.rain.length)];

        } else if (condCode == 1066 || condCode == 114 || condCode == 117 || (condCode >= 1210 && condCode <= 1237) || (condCode >= 1249 && condCode <= 1264) && acc.snowy.length != 0) {

            choosenAcc = acc.snowy[getRandomInt(0, acc.snowy.length)];

        } else if (acc.default.length != 0) {

            choosenAcc = acc.default[getRandomInt(0, acc.default.length)];

        }

        //console.log(choosenAcc)

        $.each(top, function(topI, topE) {
            $.each(bot, function(botI, botE) {
                var effectiveHeat = topE.heat
            });
        });

    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

