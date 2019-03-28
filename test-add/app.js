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
var dbname="items";
//mongoose.connect("mongodb://localhost:27017/node-demo");
mongoose.connect(CONNECTION_URL);
//yolo
var db = mongoose.connection;

//yolo
var nameSchema = new mongoose.Schema({
  type: String,
  name: String,
  heat: Number
});

var Item = mongoose.model(dbname, nameSchema);//collection is based on Item, can change all instances of "item" to choose a different db

//determines collection (+'s'), with first argument
app.get("/", (req, res) =>
{
    res.sendFile(__dirname + "/index.html");

//  mongoose.connection.db.dropCollection
//  ('items', function(err, result) {
//    if (err) throw err;

//    console.log("deleted"+ dbname +"collection");
//  });

//trying to delete



}); //puts html there


var foo = function() {
  console.log("delete function running");
};

app.post("/delcol", (req, res) =>{
  foo();

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

});

app.post("/addname", (req, res) => {

  var myData = new Item(req.body); //gets data from fields
  myData.save() //puts item into db
    .then
    (item => {
      console.log("item saved to database");
    })
    .catch(err => {
      //res.status(400).send("unable to save to database");
    });
});

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
