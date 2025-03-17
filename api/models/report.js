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
     topic_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Topic'
     },
     note: {
          type: String
     },
     status: {
          type: Number,
          default: null
     },
     recipientRole: {
          type: String, // "admin", "user", "nutr"
          // required: true
     },
     isDeleted: {
          type: Boolean,
          default: false
     },
     edit_deadline: { // deadline
          type: String, // ใช้เก็บวันที่ตั้งการแจ้งเตือน
          default: null
     },

}, { timestamps: true })

const myReport = mongoose.model('Report', reportSchema)

module.exports = myReport;