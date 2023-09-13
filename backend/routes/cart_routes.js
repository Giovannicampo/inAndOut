const express = require('express');
const Cart = require('../models/cart');
const {allowLogged, allowAdmin} = require("../middlewares/users");

const router = express.Router();

router.post('/post', allowLogged, async (req, res) => {
    const cart_data = new Cart({
        userID: req.params.userID,
        products: req.params.products
    })

    try {
        const dataToSave = await cart_data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Method
router.get('/getAll', allowLogged, allowAdmin, async (req, res) => {
    try{
        const data = await Cart.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by userID  Method
router.get('/getByUserID/:userID', async (req, res) => {
    try{
        const data = await Cart.find({
            userID : req.params.userID
        });
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Update by ID Method
router.patch('/update/:id', allowLogged, async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Cart.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Payment by ID Method
router.patch('/payment/:id', allowLogged, async (req, res) => {
    try {
        const id = req.params.id;
        const emptyCart = {
            products: req.body
        }
        const options = { new: true };

        const result = await Cart.findByIdAndUpdate(
            id, emptyCart, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})



module.exports = router;