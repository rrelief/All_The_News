// all of these npm packages are required for the assignment
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var logger = require("morgan");

//need to require Note and Article models
var Note = require("./models/Note.js");
var ScrapedData = require("./models/DataScraping.js");

// required packages that make scraping possible
var request = require("request");
var cheerio = require("cheerio");

//need to set mongoost to leverage built in javascript ES6 promises
mongoose.Promise = Promise;

//initialize app
var app = express();
var PORT = process.env.PORT || 3000;
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static("public"));
