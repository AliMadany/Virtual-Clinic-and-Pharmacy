const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    patient_id: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    items: {
        type: [{
            name: {
                type: String,
                ref: 'Medicine',
                required: true
            },
            price: {
                type: Number,
                float: true,
                required: true,
                min: 0,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                max: 100
            }
        }],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'delivered', 'cancelled'],
        required: false,
        default: 'pending',
    },
    date: {
        type: String,
        format: "date",
        required: true,
    },
    amount: {
        type: Number,
        float: true,
        required: true,
        min: 0,
    },
    payment_method: {
        type: String,
        enum: ['cash', 'wallet', 'card'],
        required: true,
    },
    paid: {
        type: Boolean,
        required: false,
        default: false,
    },
})

const Order = mongoose.model('Order', orderSchema, 'pharmacy_orders');
module.exports = Order;  