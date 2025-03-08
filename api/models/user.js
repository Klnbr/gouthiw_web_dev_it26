const mongoose = require('mongoose');

const diaryEntrySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    menuBreakfast: [
        {
            menuName: { type: String, ref: 'Menu' },
            purine: { type: Number },
            uric: { type: Number },
            qty: { type: Number, default: 1 }
        }
    ],
    menuLunch: [
        {
            menuName: { type: String, ref: 'Menu' },
            purine: { type: Number },
            uric: { type: Number },
            qty: { type: Number, default: 1 }
        }
    ],
    menuDinner: [
        {
            menuName: { type: String, ref: 'Menu' },
            purine: { type: Number },
            uric: { type: Number },
            qty: { type: Number, default: 1 }
        }
    ],
    purine_diary: {
        type: Number,
        default: 0
    },
    uric_diary: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    diary: [diaryEntrySchema],
    topic_owner: [
        {
            topic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }
        }
    ],
    purine: {
        type: Number
    },
    age: {
        type: Number
    },
    uric: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
