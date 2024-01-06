const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    patient_id: {
        type: Schema.Types.ObjectId,
        ref: "Patient",
        required: false,
        default: null
    },
    doctor_id: {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    date: {
        type: String,
        format: "date",
        required: true
    },
    start_time: {
        type: String,
        format: "time",
        required: true
    },
    end_time: {
        type: String,
        format: "time",
        required: true
    },
    status: {
        type: String,
        enum: ["free", "pending", "confirmed", "cancelled", "accepted", "revoked"],
        default: "free",
        required: true
    },
    date: {
        type: String,
        format: "date",
        required: true,
        default: Date.now
    },
    paid: {
        type: Boolean,
        required: false,
        default: false
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema, 'clinic_appointments');
module.exports = Appointment;