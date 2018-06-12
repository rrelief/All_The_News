//require mongoose
var mongoose = require("mongoose");

// Create a schema class with Mongoose for all data created from users that want to leave Comments on scraped articles
var Schema = mongoose.Schema;

// create a Comment schema as a framework for all Comments on scraped data
var CommentSchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    }
});

// Make a Comment model with the Comment Schema
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment Model so that it can be used in server.js
module.exports = Comment;