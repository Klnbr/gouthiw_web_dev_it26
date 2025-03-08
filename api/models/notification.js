const mongoose = require('mongoose');

const notiSchema = new mongoose.Schema({
     nutr_id: {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Nutr'
     },
     noti_title: {
          type: String
     },
     noti_detail: {
          type: String
     },
     noti_type: {
          type: Number
     },
     status: {
          type: Number,
          default: 0
     }
}, { timestamps: true });

const myNoti = mongoose.model('Notification', notiSchema)

module.exports = myNoti;