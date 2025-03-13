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
     views: {
          type: Number,
          default: 0
     },
     edit_deadline: {
          type: Date,
          default: null
     },
     isDeleted: {
          type: Boolean,
          default: false
     }, 
     isVisible: {
          type: Boolean,
          default: true
     },
}, { timestamps: true });

const myTrivia = mongoose.model('Trivia', triviaSchema)

module.exports = myTrivia;