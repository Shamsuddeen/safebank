const mongoose = require('mongoose');

const transationSchema = new mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        ref: 'User',
        required: true
    },
    type: String,
    accountId: {
        type: mongoose.ObjectId,
        ref: 'Accont',
        required: true
    },
    accountNumber: String,
    amount: {
        type: Number,
        required: true
    },
    channel: String,
    create_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('transactions', transationSchema);