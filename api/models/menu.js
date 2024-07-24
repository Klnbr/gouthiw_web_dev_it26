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
               ingrName: { type: String, ref: 'Ingredient' },
               ingrQty: { type: Number },
               ingrUnit: { type: String }
          }
     ],
     method: [
          String
     ],
     purine: {
          type: Number,
          required: true
     },
     uric: {
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