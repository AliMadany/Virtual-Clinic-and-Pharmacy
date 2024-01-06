const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 255
    }
});

const Admin = mongoose.model('Admin', adminSchema, 'clinic_admins');
module.exports = Admin;