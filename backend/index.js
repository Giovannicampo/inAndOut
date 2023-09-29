require('dotenv').config();

const productRouter = require('./routes/product_routes');
const authRouter = require("./routes/auth");
const cartRouter = require("./routes/cart_routes");
const orderRouter = require("./routes/order_routes");
const express = require('express');
const cookieParser = require("cookie-parser");
var cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const store = new MongoDBStore({
    uri: process.env.DATABASE_URL,
    collection: 'Sessions'
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("./frontend"));

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: "none" },
    store: store
  }));

// routes
app.use('/api/product', productRouter);
app.use(`/api/auth`, authRouter);
app.use(`/api/cart`, cartRouter);
app.use(`/api/order`, orderRouter);

app.get(`/adminhandler`, (req, res) => {
  res.redirect(`admin.html`);
})

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
});