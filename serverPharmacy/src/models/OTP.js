const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    }
});

const OTP = mongoose.model('OTP', OTPSchema, 'pharmacy_OTP');
module.exports = OTP;  