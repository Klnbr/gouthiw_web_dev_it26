const mongoose = require('mongoose');

const triviaSchema = new mongoose.Schema({
     head: {
          type: String,
          required: true,
     },
     image: {
          type: String
     },
     content: {
          type: String
     },
     isDeleted: {
          type: Boolean,
          default: false, // Set a default value if needed
     },
}, { timestamps: true });

const myTrivia = mongoose.model('Trivia', triviaSchema)

module.exports = myTrivia;