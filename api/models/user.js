const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    uric: {
        type: Number
    },
    image_profile: {
        type: String
    },
    image_background: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        require: true
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    verificationToken: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
