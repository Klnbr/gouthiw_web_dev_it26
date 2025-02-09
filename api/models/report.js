const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
     triv_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Trivia'
     },
     nutr_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Nutr'
     },
     user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
     },
     content_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Topic'
     },
     note: {
          type: String
     },
     status: {
          type: Number,
          default: 0
     },
     notification: {
          type: Number,
          default: 0
     },
     recipientRole: {
          type: String, // "admin", "user", "nutr"
          required: true
     },
     isDeleted: {
          type: Boolean,
          default: false
     },
}, { timestamps: true })

const myReport = mongoose.model('Report', reportSchema)

module.exports = myReport;