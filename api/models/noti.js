const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');

const notiSchema = new mongoose.Schema({
    report_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
    },
    recipients: [
        {
            nutr_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Nutr', required: true },
            message: { type: String, required: true }, // ข้อความที่แตกต่างกัน
            report_role: { type: String, required: true },
            isRead: { type: Boolean, default: false }
        }
    ],
    content_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    },
    triv_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trivia'
    },
    title: {
        type: String,
        required: true
    }, 
    status_report: {
        type: Number,
        default: 0
    },
    note: {
        type: String
    },
    reminderDate: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

const myNoti = mongoose.model('Notification', notiSchema)

module.exports = myNoti;