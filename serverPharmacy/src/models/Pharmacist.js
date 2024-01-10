const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pharmacistSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
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
    },
    date_of_birth: {
        type: String,
        format: "date",
        required: true
    },
    hourly_rate: {
        type: Number,
        float: true,
        required: true,
        min: 0,
        max: 1000
    },
    affiliation: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    education: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
        required: true
    },
    pharmacist_id: Buffer,
    pharmacy_degree: Buffer,
    working_license: Buffer,
    paidThisMonth: {
        type: Boolean,
        default: false
    },
});

const Pharmacist = mongoose.model('Pharmacist', pharmacistSchema, 'pharmacy_pharmacists');
module.exports = Pharmacist;  