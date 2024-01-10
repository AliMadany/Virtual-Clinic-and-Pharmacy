const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
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
    specialty: {
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
    acceptedContract: {
        type: Boolean,
        default: false,
        required: true
    },
    doctor_id: {
        type: Buffer,
        required: true,
    },
    medical_license: {
        type: Buffer,
        required: true
    },
    medical_degree: {
        type: Buffer,
        required: true

    }
});

const Doctor = mongoose.model('Doctor', doctorSchema, 'clinic_doctors');
module.exports = Doctor;