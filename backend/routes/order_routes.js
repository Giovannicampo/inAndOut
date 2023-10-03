const express = require('express');
const Order = require('../models/order');
const {allowLogged, allowAdmin} = require("../middlewares/users");

const router = express.Router();

router.post('/post', allowLogged, async (req, res) => {
    const order_data = new Order({
        userID: req.body.userID,
        products: req.body.products,
        totalCost: req.body.totalCost,
        state: req.body.state,
        orderID: req.body.orderID,
        date: req.body.date
    })

    try {
        const dataToSave = await order_data.save();
        res.status(200).json({
            order: dataToSave,
            type: "success"
        })
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Method
router.get('/getAll', allowLogged, allowAdmin, async (req, res) => {
    try{
        const data = await Order.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by userID  Method
router.get('/getByUserID/:userID', async (req, res) => {
    try{
        const data = await Order.find({
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

        const result = await Order.findByIdAndUpdate(
            id, updatedData, options
        )

        // res.send(result)
        res.status(200).json({
            type: "success",
            result: result
        })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;