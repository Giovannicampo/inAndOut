const mongoose = require(`mongoose`);

const order = new mongoose.Schema({
    userID: {
        required: true,
        type: String
    },
    products: [],
    totalCost: {
        required: true,
        type: Number
    },
    state: {
        required: true,
        type: String
    },
    orderID: {
        required: true,
        type: String
    },
    date: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Order', order)