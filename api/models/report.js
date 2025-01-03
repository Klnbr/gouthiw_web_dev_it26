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
     note: {
          type: String
     },
     status: {
          type: Number,
          default: 0
          // 0 = ส่งให้แล้ว แต่ยังไม่มีอะไรเกิดขึ้น
          // 1 = แอดมินได้รับแล้ว
          // 2 = แอดมินตอบกลับแล้ว
     }
},{ timestamps: true })

const myReport = mongoose.model('Report', reportSchema)

module.exports = myReport;