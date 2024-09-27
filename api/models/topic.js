const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    detail: {
        type: String,
        require: true
    },
    answer: [
        {
            nutr_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Nutr' },
            answer_detail: { type: String }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{ timestamps: true });

const myTopic = mongoose.model('Topic', topicSchema)

module.exports = myTopic;