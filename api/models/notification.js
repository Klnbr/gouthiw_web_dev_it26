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
          // 0 = trivia
          // 1 = topic
          // 2 = ingr
     },
     status: {
          type: Number,
          default: 0
          // 0 = ยังไม่ถูกอ่าน
          // 1 = ถูกอ่าน
          // 2 = ถูกคลิกดู
     }
}, { timestamps: true });

const myNoti = mongoose.model('Notification', notiSchema)

module.exports = myNoti;