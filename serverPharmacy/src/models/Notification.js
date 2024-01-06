const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    medicine: {
        type: Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
    },
    date: {
        type: String,
        format: Date,
        required: true
    },
    time: {
        type: String, 
        format: Time,
        required: true
    }
});

const Notification = mongoose.model('Notification', notificationSchema, 'pharmacy_notifications');
module.exports = Notification;  