// few dependencies required for he 
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var logger = require("morgan"); //http request logger middleware for node.js --> shorter response time

//initialize Express App
var express = require('express');
var app = express();

var PORT = process.env.PORT || 3000;
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// need to connect to the Mongo db
mongoose.connect('mongodb://localhost/tech-article-scraper');

var db = mongoose.connection;
db.on('error', function (error) {
  console.log("Database error message: " + error);
});

db.once('open', function() {
  console.log('Mongoose connection sucessful!');
});


var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Listening on PORT ' + port);
});

