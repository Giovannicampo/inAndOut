# in&out - E-commerce for indoor and outdoor design

### Web Development course project - 2022/2023



## Introduction

*in&out* is an e-commerce developed in HTML5, CSS3, Javascript, Node.js and MongoDB for Web development course project. The idea and the design of the pages has been made in collaboration with students of Arts Academy of Catania.



## Database schema



![](pics/database_schema.png)



Database is designed in order to make the handling of the application data as easier as possible. Dividing `Orders` and `Carts` collections from `Users` made easier to manage API calls for administrator management and a better scalability, but increased the number of API calls needed to achieve certain tasks.



## Back-end technologies

The back-end side has been designed in Node.js and modules like:

- **express.js** is the main library used for back-end routes and endpoints management

- **express-session**, used for the management of user authentication sessions and front-end communication;
- **mongoose**, **dotenv**, **connect-mongodb-session**, used for database management and communication through models contained in [models/](backend/models) and routes contained in [routes/](backend/routes)
- **bcryptjs**, used for password hashing



### API endpoints

Here are some example of API endpoints within routes:

| PATH                           | METHOD | DESCRIPTION                                                  |
| ------------------------------ | ------ | ------------------------------------------------------------ |
| /api/auth/signin               | POST   | It creates a session in which user is logged                 |
| /api/auth/me                   | GET    | It returns a JSON object containing all infos about the logged user |
| /api/auth/update               | PATCH  | It updates the modified elements within user infos           |
| /api/product/getAll            | GET    | It returns all the products within Product collection        |
| /api/order/getByUserID/:userID | GET    | It returns all orders related to the primary key userID      |
| /api/cart/getByUserID/:userID  | GET    | It returns the unique cart related to the primary key userID |
| /api/order/update/:id          | PATCH  | It updates the modified elements within the selected order   |
| /api/cart/payment/:id          | PATCH  | It empties the selected cart after payment transaction       |
| /api/signin/admin              | POST   | It creates a session in which only an admin user can log in  |



### Middlewares

An useful property given by express.js is the use of middlewares within routes calls.

Middlewares have been used in `index.js` file for the main configurations of sessions, static files and routes:

```javascript
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
```



and in [middlewares/users.js](backend/middlewares/users.js) for user authentication in the middle of API endpoints:

```javascript
const allowAdmin = (req, res, next) => {
    try{
        if(req.session && req.session.user && 
            req.session.user.level == "admin") {
            next();
        } else {
            return res.status(401).send({
                message: "There is no session or user on!",
                type: "error"
            })
        }

    } catch (error) {
        return res.status(500).send({
            message: "User not allowed!",
            type: "error"
        })
    }
}
```



## Main functionality

The e-commerce is born from the idea of two interior designers of making their own business, selling their products and showing how these last fit in their designed environments.

Users can easily navigate through the site, choose the products and add them in the cart; then, create a profile and buy the products.

Finally, in their own profile, users can take a look at their products and modify their infos.



### Adminhandler page

Administrator has its own dedicated page in which can manage every aspect of the application:

- view, add and update products;
- view all users' info;
- view all orders and change their state;
- view stats;



## Usage

##### Install `npm` and execute `npm i` for installing all dependencies; then execute `npm start` to start the server and go to http://localhost:3000/ for accessing the homepage or to http://localhost:3000/adminhandler for the administrator handler page.



## Author

Giovanni Campo