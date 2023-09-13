const mongoose = require(`mongoose`);

const cart = new mongoose.Schema({
    userID: {
        required: true,
        type: String
    },
    products: []
})

module.exports = mongoose.model('Cart', cart)