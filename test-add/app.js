var express = require("express");
var app = express();
var port = 3000;
//sets up express and is on port
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//used to get values from input fields

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//used to access database

//const CONNECTION_URL = "mongodb+srv://user:password@cluster0-grpgd.mongodb.net/databasename?retryWrites=true";
// edit "testdb" to "weather" to choose database
const CONNECTION_URL = "mongodb+srv://test2:pass123@cluster0-grpgd.mongodb.net/testdb?retryWrites=true";

//mongoose.connect("mongodb://localhost:27017/node-demo");
mongoose.connect(CONNECTION_URL);
var nameSchema = new mongoose.Schema({
  type: String,
  name: String,
  heat: Number
});

var Item = mongoose.model("newcollectiontest", nameSchema);//collection is based on Item, can change all instances of "item" to choose a different db

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
}); //puts html there

app.post("/addname", (req, res) => {
  var myData = new Item(req.body); //gets data from fields
  myData.save() //puts item into db
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
