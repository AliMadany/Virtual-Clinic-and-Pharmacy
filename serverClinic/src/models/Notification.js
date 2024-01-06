const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    appointmend_id: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const Notification = mongoose.model('Notification', notificationSchema, 'pharmacy_notifications');
module.exports = Notification;  