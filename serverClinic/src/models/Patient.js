const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const healthRecordSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    file: {
      type: Buffer,
      required: true
    }
  });

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
    package: {
        type: Schema.Types.ObjectId,
        ref: 'Package',
        required: false
    },
    family_members: {
        type: [{
            // id: {
            //     type: Schema.Types.ObjectId,
            //     ref: 'User'
            // },
            nationalId: {
                type: String,
                required: true,
            },
            relation: {
                type: String,
                enum: ["wife", "husband", "children"],
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            age: {
                type: String,
                required: true,
                min: 0,
            },
            gender: {
                type: String,
                required: true,
            },
            health_package: {
                type: Schema.Types.ObjectId,
                ref: 'Package',
                required: false,
                default: null
            },
            renewal_date: {
                type: String,
                format: "date",
                required: false
            },
            cancel_date: {
                type: String,
                format: "date",
                required: false
            },
        }],
        required: false
    },
    health_package: {
        type: Schema.Types.ObjectId,
        ref: 'Package',
        required: false
    },
    renewal_date: {
        type: String,
        format: "date",
        required: false
    },
    cancel_date: {
        type: String,
        format: "date",
        required: false
    },
    wallet: {
        type: Number,
        float: true,
        required: false,
        default: 0
    },
    health_records: {
        type: [healthRecordSchema],
        required: false,
        default: []
    },
});

const Patient = mongoose.model('Patient', patientSchema, 'clinic_patients');
module.exports = Patient;