const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    user1_id: {
        type: String,
        required: true
    },
    user2_id: {
        type: String,
        required: true
    },
    messages: {
        type: [{
            sender_id: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            },
            date: {
                type: String,
                format: "date",
                required: true
            },
            time: {
                type: String,
                format: "time",
                required: true
            }
        }],
        required: false
    }
});

const Chat = mongoose.model('Chat', chatSchema, 'chats');
module.exports = Chat;  