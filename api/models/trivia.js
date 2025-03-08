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
     trivia_type: {
          type: String
     },
     isDeleted: {
          type: Boolean,
          default: false
     }, isVisible: {
          type: Boolean,
          default: false
     },
}, { timestamps: true });

const myTrivia = mongoose.model('Trivia', triviaSchema)

module.exports = myTrivia;