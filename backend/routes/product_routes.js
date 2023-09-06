const express = require('express');
const Product = require('../models/product');

const router = express.Router();

router.post('/post', async (req, res) => {
    const product_data = new Product({
        name: req.body.name,
        maincategory: req.body.maincategory,
        category: req.body.category,
        quantity: req.body.quantity,
        image: req.body.image,
        description: req.body.description
    })

    try {
        const dataToSave = await product_data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Method
router.get('/getAll', async (req, res) => {
    try{
        const data = await Product.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try{
        const data = await Product.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by name Method
router.get('/getByName/:name', async (req, res) => {
    try{
        const data = await Product.find({
            name : req.params.name
        });
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by main category Method
router.get('/getByMainCategory/:main', async (req, res) => {
    try{
        const data = await Product.find({
            maincategory : req.params.main
        });
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by subcategory Method
router.get('/getByCategory/:category', async (req, res) => {
    try{
        const data = await Product.find({
            category : req.params.category
        });
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by main and subcategory Method
router.get('/getByCategory/:main/:category', async (req, res) => {
    try{
        const data = await Product.find({
            maincategory : req.params.main,
            category : req.params.category
        });
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})



//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Product.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Product.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;