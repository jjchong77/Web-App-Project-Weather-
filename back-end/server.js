// Set up server
var express = require('express');
var app = express();

// Set port to 3000
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + "/../front-end"));

// Body Parser
var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Database
var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://test2:pass123@cluster0-grpgd.mongodb.net/weather?retryWrites=true", { useNewUrlParser: true });
var nameSchema = new mongoose.Schema({
    type: String,
    name: String,
    heat: Number,
    weather: String
});
var outfitdbModel;

//Jquery
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = jQuery = require('jquery')(window);

//---------------------------------------------------------------------------
var db = [];
var user;
var loc, temp, range;

// Load Initial Index/Database Page
app.get ('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/../front-end/index.html'));
});

// Set Database Name
app.post ('/', function(request, response) {
    user = request.body.user;
    outfitdbModel = mongoose.model(user, nameSchema);
    console.log("intro " + user);
    
    outfitdbModel.find({}, function (error, documents) {
        response.send(documents);
    });
});

// Add to User Database 
app.post("/add", (req, res) => {
    console.log("/add")
    var awesome_instance = new outfitdbModel(req.body);

    awesome_instance.save(function (err, item) {
        if (err) return console.error(err);
        console.log(item.name + " saved to collection."); 

        outfitdbModel.find({}, function (error, documents) {
            res.send(documents);
        });
    });
});

// Submit Location, Comfort Temperature and Variance
app.post("/weather", (req, res) => {
    console.log("/weather")

    loc = req.body.location;
    temp = req.body.temperature;
    range = req.body.range;

    console.log(loc + " " + temp + " " + range);

    $.get("https://api.apixu.com/v1/forecast.json?key=03ab689a2dc0497d86e214654191303&q="+ loc + "&days=7", function(data){
        res.send(data);
    }); 
});

// Get Result Button 
app.post("/result", (req, res) => {
    console.log("/result")
    
    if (typeof user == 'undefined'){
        res.send("Please set your database name first.")
    } else {
        outfitdbModel.find({}, function (error, documents) {
            db = documents;

            var topExist = false;
            var botExist = false;
            var accExist = false;

            for (var i = 0; i < db.length; i++){
                if (db[i].type == 'top') {
                    topExist = true;
                }

                if (db[i].type == 'bot') {
                    botExist = true;
                }

                if (db[i].type == 'acc') {
                    accExist = true;
                }
            }

            if (typeof loc !== 'undefined' && typeof temp !== 'undefined' && typeof range !== 'undefined' && topExist && botExist && accExist) {
                calClothing(loc, temp, range, res)
            } else {
                res.send("Please input at least one Top, Bottom and Accessory Item. Also, please make sure that you have submitted Location, Temperature and Temperature Variance.");
            }  
        });
    }
});

// Delete Database
app.post("/result/delete", (req, res) =>{
    console.log('/delete')
    if (typeof user == 'undefined'){
        res.send("Please set your database name first.")
    } else {

        var collName = Object.keys(outfitdbModel.db.collections)[0];
        mongoose.connection.dropCollection(collName, function (err, result) {
            if (err) {
                console.log("error delete collection");
                res.send("Failed to delete Database.")
            } else {
                console.log("delete collection success");
                res.send("Database Deleted.")
            }
        });
    }
});

// Port Listener
app.listen(app.get('port'), function() {    
    console.log('Server listening on port ' + app.get('port')); 
});

// Calculate the best combinations of outfit to wear
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
        } else if (element.type == 'bot') {
            bot.push(element)
        } else if (element.type == 'acc') {
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

    console.log(top)
    console.log(bot)
    console.log(acc)

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
                poss.push({top: 'shirt', bot: 'short', acc: 'hat', delta: 2});
            } else {
                poss.push({top: 'heavy coat', bot: 'snow pants', acc: 'scarf', delta: 6});
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

        console.log(finalOutfit)
        response.send(finalOutfit);
    });
}

// If there are multiple possible outfit then choose one randomly
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
