const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        min: 1,
        max: 255
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    session_discount: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    medicine_discount: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    family_discount: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    }
});

const Package = mongoose.model('Package', packageSchema, 'clinic_packages');
module.exports = Package;