const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
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
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    mobile_number: {
        type: String,
        required: true,
        min: 10,
        max: 10
    },
    emergency_contact: {
        type: {
            name: {
                type: String,
                required: true,
                min: 3,
                max: 255
            },
            mobile_number: {
                type: String,
                required: true,
                min: 10,
                max: 10
            },
            relation: {
                type: String,
                required: true,
                min: 3,
                max: 255
            }
        },
        required: true
    },
    addresses: {
        type: [{
            address: {
                type: String,
                required: true,
                min: 3,
                max: 255
            }
        }],
        required: false,
        default: []
    },
    wallet: {
        type: Number,
        float: true,
        required: false,
        default: 0
    },
    cart: {
        type: [{
            medicine: {
                type: Schema.Types.ObjectId,
                ref: 'Medicine',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                max: 100
            }
        }],
        required: false,
        default: []
    }
});

const Patient = mongoose.model('Patient', patientSchema, 'pharmacy_patients');
module.exports = Patient;  