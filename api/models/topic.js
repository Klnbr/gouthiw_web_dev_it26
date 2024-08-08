const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
     title: {
          type: String,
          required: true,
     },
     image: {
          type: String
     },
     detail: {
          type: String
     },
     answer: {
          type: String
     },
     isDeleted: {
          type: Boolean,
          default: false, // Set a default value if needed
     },
}, { timestamps: true });

const myTopic = mongoose.model('Topic', topicSchema)

module.exports = myTopic;