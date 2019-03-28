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
//const MongoClient = require('mongodb').MongoClient;
//const uri = "mongodb+srv://test_user:password1234@cluster0-grpgd.mongodb.net/test?retryWrites=true";
//const client = new MongoClient(uri, { useNewUrlParser: true });

var mongoose = require("mongoose");
// edit "testdb" to "weather" to choose database
mongoose.connect("mongodb+srv://test2:pass123@cluster0-grpgd.mongodb.net/weather?retryWrites=true");

var nameSchema = new mongoose.Schema({
    type: String,
    name: String,
    heat: Number,
    weather: String
});

const Items = mongoose.model('items', nameSchema);


//Jquery
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

//---------------------------------------------------------------------------
var db = [];

Items.find({}, function (error, documents) {
    db = documents
});

app.get ('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/../front-end/index.html'));
});

app.post ('/', function(request, response) {
    var loc = request.body.location;
    var temp = request.body.temperature;
    var range = request.body.range;
    //console.log(db);
    calClothing(loc, temp, range, response);
    //response.send(calClothing(loc, temp, range));
});

app.get('/indexx.html', function(req,res) {
    console.log("Hello")
    data= fs.readFile('/../front-end/indexx.html',   function (err, data) {
        res.setHeader('Content-Type', 'text/html');
        res.send(data);
    });
});

app.post("/addname", (req, res) => {
    /*
    var myData = new Item(req.body); //gets data from fields
    myData.save() //puts item into db
        .then
    (item => {
        console.log("item saved to database");
    })
        .catch(err => {
        //res.status(400).send("unable to save to database");
    });
    */
});

app.post("/delcol", (req, res) =>{
    foo();
    /*
    mongoose.connection.db.dropCollection('items', function(err, result)
                                          {
        if (err)
        {
            console.log ("error deleting");
            //throw (err);
            alert("already cleared");
        }
        console.log("Database cleared!");
    });

    //trying to delete
*/
});

//Connect to Database
/*
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
*/

app.listen(app.get('port'), function() {    
    console.log('Server listening on port ' + app.get('port')); 
});

var foo = function() {
    console.log("delete function running");
};

function calClothing(location, comfortTemp, rangeTemp, response) {
    var top = [];
    var bot = [];
    var acc = {snowy: [], sunny: [], rain: [], default: []};

    var choosenTop = [];
    var choosenBot = [];
    var choosenAcc;
    var finalOutfit;

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

    $.getJSON("https://api.apixu.com/v1/forecast.json?key=03ab689a2dc0497d86e214654191303&q=" + location, function(data){
        //console.log(data.current.condition.code)
        var minTemp = comfortTemp - rangeTemp;
        var maxTemp = parseInt(comfortTemp) + parseInt(rangeTemp);
        var condCode = data.current.condition.code
        var currentTemp = data.current.temp_c;
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
                var effectiveHeat = topE.heat + botE.heat + choosenAcc.heat + currentTemp;
                //console.log(effectiveHeat)

                if (effectiveHeat >= minTemp && effectiveHeat <= maxTemp) {
                    var delta = Math.abs(topE.heat - botE.heat);
                    poss.push ({top: topE.name, bot: botE.name, acc: choosenAcc.name, delta: delta});
                }
            });
        });

        if (poss.length == 0) {
            if (currentTemp > 0) {
                poss.append({top: 'shirt', bot: 'short', acc: 'hat', delta: 2});
            } else {
                poss.append({top: 'heavy coat', bot: 'snow pants', acc: 'scarf', delta: 6});
            }
        }

        //Default outfit
        finalOutfit = poss[0];

        if (poss.length > 1) {
            var possOutfits = []
            var baseDelta = poss.reduce((min, p) => p.delta < min ? p.delta : min, poss[0].delta);

            $.each(poss, function(possI, possE) {
                if (possE.delta == baseDelta) {
                    possOutfits.push(possE)
                }
            });

            if (possOutfits.length > 1) {
                finalOutfit = possOutfits[getRandomInt(0, possOutfits.length)];
            }
        }

        console.log("1")
        console.log(finalOutfit)
        response.send(finalOutfit);
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

