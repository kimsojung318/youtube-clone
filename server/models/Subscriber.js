const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    userTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom: {
        type:  Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true }) // 만든 일자와 업데이트 일자 표시를 위해


const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }