//require mongoose
var mongoose = require("mongoose");

// Create a schema class with Mongoose for all data created from users that want to leave notes on scraped articles
var schema = mongoose.Schema;

// create a note schema as a framework for all notes on scraped data
var ScrapedDataSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: string,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Notes"
    }]
});

// Make a Note model with the Note Schema
var ScrapedData = mongoose.model("ScrapedData", ScrapedDataSchema);

// Export the Note Model so that it can be used in server.js
module.exports = ScrapedData;