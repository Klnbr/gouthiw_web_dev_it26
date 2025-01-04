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
     }
},{ timestamps: true })

const myReport = mongoose.model('Report', reportSchema)

module.exports = myReport;