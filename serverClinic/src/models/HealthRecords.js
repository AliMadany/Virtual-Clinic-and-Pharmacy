const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const healthRecordsSchema = new Schema({
    patient_id: {
        type: Schema.Types.ObjectId,
        ref: 'doctor',
        required: true
    },
    health_records: [{
        filename: {
            type: String,
            required: true
        },
        filetype: {
            type: String,
            required: true
        },
        filesize: {
            type: Number,
            float: true,
            required: true
        },
        filedata: {
            type: Buffer,
            required: true
        }
    }]
});

const HealthRecords = mongoose.model('HealthRecords', healthRecordsSchema, 'clinic_health_records');
module.exports = HealthRecords;  