const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');

const nutrSchema = new mongoose.Schema({
     firstname: {
          type: String,
          required: true
     },
     lastname: {
          type: String,
          required: true
     },
     license_number: {
          type: String,
          required: true,
          unique: true
     },
     tel: {
          type: String,
          required: true
     },
     email: {
          type: String,
          required: true,
          unique: true
     },
     image_profile: {
          type: String
     },
     image_background: {
          type: String
     },
     password: {
          type: String,
          required: true
     },
     role: {
          type: String,
          default: '0'
     },
     menu_owner: [
          {
               menu_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }
          }
     ],
     triv_owner: [
          {
               triv_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trivia' }
          }
     ],
     ingr_owner: [
          {
               ingr_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingr' }
          }
     ],
     isDeleted: {
          type: Boolean,
          default: false
     },
}, { timestamps: true })

const myNutr = mongoose.model('Nutr', nutrSchema)

module.exports = myNutr