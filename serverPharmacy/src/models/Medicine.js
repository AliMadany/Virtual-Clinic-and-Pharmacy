const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicineSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    price: {
        type: Number,
        float: true,
        required: true,
        min: 0,
    },
    picture: {
        type: Buffer,
        required: true,
    },
    description: {
        type: String,
        required: true,
        min: 3,
        max: 1024
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    sales: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    use: {
        type: String,
        required: true,
        min: 3,
        max: 1024
    },
    ingredients: {
        type: [String],
        required: true,
        min: 1,
        max: 1024
    },
    archived: {
        type: Boolean,
        required: false,
        default: false
    },
    in_stock: {
        type: Boolean,
        required: false,
        default: true
    }
});

const Medicine = mongoose.model('Medicine', medicineSchema, 'pharmacy_meds');
module.exports = Medicine;