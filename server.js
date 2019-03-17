var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + "/public"));

app.get ('/', function(request, response) {
    response.send('Hello from Node.js and Express!'); 
});

app.get('/hello', function(request, response) { 
    response.send('Hello, ' + request.query.name);
});

app.listen (app.get('port'), function() {
    console.log('Server listening on port' + app.get('port'));
});