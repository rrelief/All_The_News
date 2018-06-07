//require mongoose
var mongoose = require("mongoose");

// Create a schema class for all data using mongoose
var schema = mongoose.Schema;

// create a note schema as a framework for all scraped data
var NoteSchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    }
});

// Make a Note model with the Note Schema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note Model so that it can be used in server.js
module.exports = Note;