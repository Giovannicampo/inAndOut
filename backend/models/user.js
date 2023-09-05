const mongoose = require(`mongoose`);

const user = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    surname: {
        required: true,
        type: String
    },
    cart: [],
    orders: [],
    deliveryInfo: {
        address: {
            required: false,
            type: String
        },
        postalCode: {
            required: false,
            type: String
        },
        country: {
            required: false,
            type: String
        }
    },
    paymentCard: {
        numberCard: {
            required: false,
            type: String
        },
        expirationDate: {
            required: false,
            type: String
        },
        pass: {
            required: false,
            type: String
        }
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    verified: {
        type: Boolean,
        default: false,
    },
    refreshtoken: {
        type: String,
    }
})

module.exports = mongoose.model('User', user)