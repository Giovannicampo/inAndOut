require('dotenv').config();

const productRouter = require('./routes/product_routes');
const authRouter = require("./routes/auth");
const express = require('express');
const cookieParser = require("cookie-parser");
var cors = require('cors');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use('/api/product', productRouter);
app.use(`/api/auth`, authRouter);

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
});