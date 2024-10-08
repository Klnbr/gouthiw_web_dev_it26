const mongoose = require('mongoose');

const ingreSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true
     },
     purine: {
          type: Number
     },
     uric: {
          type: Number
     },
     ingr_type: {
          type: String
     },
     isDeleted: {
          type: Boolean,
          default: false
     },
}, { timestamps: true });

const myIngr = mongoose.model('ingr', ingreSchema);

module.exports = myIngr;
