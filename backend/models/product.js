const mongoose = require('mongoose');

const product = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    maincategory: {
        required: true,
        type: String
    },
    category: {
        required: true,
        type: String
    },
    quantity: {
        required: true,
        type: Number
    },
    price: {
        required: true,
        type: Number
    },
    image: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Data', product)