// Set up server
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + "/../front-end"));
//Index HTML
app.get ('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/../front-end/index.html'));
});

app.listen(app.get('port'), function() {    
    console.log('Server listening on port ' + app.get('port')); 
});

// Wire up some logic for the connection event (when a client connects) 
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        //Jquery
        var jsdom = require("jsdom");
        const { JSDOM } = jsdom;
        const { window } = new JSDOM();
        const { document } = (new JSDOM('')).window;
        global.document = document;
        var $ = jQuery = require('jquery')(window);

        var message = message.split('#')
        var city = message[0];

        //Database
        const MongoClient = require('mongodb').MongoClient;
        const uri = "mongodb+srv://test_user:password1234@cluster0-grpgd.mongodb.net/test?retryWrites=true";
        const client = new MongoClient(uri, { useNewUrlParser: true });

        //Connect to Database
        client.connect(err => {
            const collection = client.db("weather").collection("items");
            collection.find().toArray(function (err, docs) {
                //console.log(docs);

                $.get("https://api.apixu.com/v1/forecast.json?key=03ab689a2dc0497d86e214654191303&q=" + city, function(data){
                    console.log(data)
                    //Send a message to the client 
                    ws.send('Hello client!');
                });
            });
            client.close();
        });
    });
});
