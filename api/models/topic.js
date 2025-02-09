const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        auto: true 
    },
    nutr_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Nutr' 
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    answer_detail: { 
        type: String,
        required: true
    },
    replies: [
        {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            reply_detail: { 
                type: String,
                required: true
            },
            isDeleted: {
                type: Boolean,
                default: false
            }
        }
    ],
    parentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Answer',
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: [{
        type: String
    }],
    detail: {
        type: String,
        require: true
    },
    answer: [answerSchema],
    user_id: {
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