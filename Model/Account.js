const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        ref: 'User',
        required: true
    },
    accountId: { // account ID from Sudo (Issuer)
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: false,
        default: 0
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('accounts', accountSchema);