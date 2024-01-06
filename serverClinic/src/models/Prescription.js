const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
    medicines: {
        type: [{
            name: {
                type: String,
                required: true,
                min: 1,
                max: 255
            },
            dosage: {
                type: String,
                required: true,
                min: 1,
                max: 255
            }
        }],
        required: true,
        min: 1
    },
    doctor_id: {
        type: String,
        required: true,
        ref: 'Doctor'
    },
    patient_id: {
        type: String,
        required: true
    },
    date: {
        type: String,
        format: "date",
        required: true
    },
    status: {
        type: String,
        enum: ["filled", "not filled"],
        default: "not filled",
        required: true
    },
    submitted: {
        type: Boolean,
        default: false,
        required: false
    },
    file: {
        type: Buffer,
        required: true
    },
});

const Perscription = mongoose.model('Perscription', prescriptionSchema, 'clinic_prescriptions');
module.exports = Perscription;
