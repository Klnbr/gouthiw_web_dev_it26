const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
     menuName: {
          type: String,
          required: true,
          unique: true
     },
     category: {
          type: String,
          required: true
     },
     ingredients: [
          {
               ingr_id: { type:  mongoose.Schema.Types.ObjectId, ref: 'Ingr' },
               qty: { type: Number },
               unit: { type: String }
          }
     ],
     method: [
          String
     ],
     purine_total: {
          type: Number,
          required: true
     },
     uric_total: {
          type: Number,
          required: true
     },
     image: {
          type: String,
          required: true
     },
     isDeleted: {
          type: Boolean,
          default: false, // Set a default value if needed
     }
}, { timestamps: true });

const myMenu = mongoose.model('Menu', menuSchema)

module.exports = myMenu;