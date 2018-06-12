//require mongoose
var mongoose = require("mongoose");

// Create a schema class with Mongoose for all data created from users that want to leave notes on scraped articles
var Schema = mongoose.Schema;

// create a Article schema that acts as a framework for all scraped articles
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

// Make a Note model with the Note Schema
var Article = mongoose.model("Article", ArticleSchema);

// Export the Note Model so that it can be used in server.js
module.exports = Article;