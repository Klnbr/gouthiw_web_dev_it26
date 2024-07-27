const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
     password: {
          type: String,
          required: true
     },
     confirm_password: {
          type: String,
          required: true
     },
     menu_owner: [
          {
               menuName: { type: String, ref: 'Menu' }
          }
     ],
     triv_owner: [
          {
               head: { type: String, ref: 'Trivia' }
          }
     ],
     isDeleted: {
          type: Boolean,
          default: false
     },
}, { timestamps: true })

const myUser = mongoose.model('User', userSchema)

module.exports = myUser