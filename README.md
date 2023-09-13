# in&out - E-commerce for indoor and outdoor design

### Web Development course project - 2022/2023



## Introduction

*in&out* is an e-commerce of two interior designers that decided to join together and show their products and works within the environments they were thought for.

Users can easily navigate through the site, take a look at the **indoor** and **outdoor** sections and appreciate the style and the colors of the products within their designed place.

As a visitor, you can just take a look at the products and go out, however if you get interested and decide to purchase, you can sign up and log in your personal profile page, where you can easily manage your personal information such as email, password, address and payment card, and view your orders history.

Furthermore, once you have logged in, you have your personal cart, that gets saved whenever you add o remove a product from it, and eventually you are able to purchase your products and make the house of your dream!



## Back-end technologies

For the back-end side, the main technologies that have been used are **Node.js** as the main framework for the communication of the front-end side, the server and the database, **Express.js** , a library for the management of the routes through RESTful APIs and **MongoDB**, a non-relational DBMS, oriented on documents.

There are other dependencies installed within the project, like **jsonwebtoken** and **bycryptjs**, used for authentication and hashing, and **dotenv** and **mongoose**, used for the link with the database.

The gateway of the server is placed in **index.js** file, where thanks to express, have been declared some middlewares, useful for an easier management of the APIs.

```javascript
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
```

------

In the **models** directory, there are the models used for the design of the documents stored inside the collections of the database. Specifically the models are for **products** and **users**:

```javascript
// from models/product.js
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
```

In **routes** directory, there are all the routes that handle the communication between front-end side, the server and the database. Apart from the classical GET and POST endpoints of the products, in **auth.js**, there have been implemented more delicate calls for granting safety and reliability.

An example, it is the use of middlewares for protected routes and use of JWT Tokens:

##### Sign in POST API

```javascript
// from auth.js
const user = await User.findOne({ email: email });
  
// if user doesn't exist, return error
if (!user)
return res.status(500).json({
  message: "L'utente non esiste! 😢",
  type: "error",
});
// 2. if user exists, check if password is correct
const isMatch = await compare(password, user.password);

// if password is incorrect, return error
if (!isMatch)
return res.status(500).json({
  message: "La password non è corretta! ⚠️",
  type: "error",
});

// 3. if password is correct, create the tokens
const accessToken = createAccessToken(user._id);
const refreshToken = createRefreshToken(user._id);

// 4. put refresh token in database
user.refreshtoken = refreshToken;
await user.save();

// 5. send the response
sendRefreshToken(res, refreshToken);
sendAccessToken(req, res, accessToken);
```



**Protected middleware**

```javascript
// from protected.js
const authorization = req.headers["authorization"];
  // if we don't have a token, return error
  if (!authorization)
    return res.status(500).json({
      message: "No token! 🤔",
      type: "error",
    });
  // if we have a token, you have to verify it
  const token = authorization.split(" ")[1];
  let id;
  try {
    id = verify(token, process.env.ACCESS_TOKEN_SECRET).id;
  } catch {
    return res.status(500).json({
      message: "Invalid token! 🤔",
      type: "error",
    });
  }
  // if the token is invalid, return error
  if (!id)
    return res.status(500).json({
      message: "Invalid token! 🤔",
      type: "error",
    });
  // if the token is valid, check if the user exists
  const user = await User.findById(id);
  // if the user doesn't exist, return error
  if (!user)
    return res.status(500).json({
      message: "User doesn't exist! 😢",
      type: "error",
    });
  // if the user exists, we'll add a new field "user" to the request
  req.user = user;
  // call the next middleware
  next();
```



## Front-end technologies

For the front-end side, the main technologies that have been used are **HTML5**, **CSS3** and **Javascript ES6**. The decision not to use frameworks for the front-end was related to the collaboration with another colleague from an Arts academy that couldn't use those technologies, so we started this adventure!



##### Flexbox and grid containers

Most of  the elements within the project have been realized using flex-box and grid systems, in order to make easier for us to make the site responsive for every resolution. Here is an example of CSS flex-box container designed for the products.

```css
// from prodotti.css
.composite>.products {
    flex: 3;
    height: auto;
    /* border: 2px solid blue; */

    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.composite>.products .row {
    flex: 1;
    height: auto;
    flex-wrap: wrap;

    display: flex;
    flex-direction: row;
}

.composite>.products .row .card {
    flex: 500px 1;
    height: 700px;
    /* border: 2px solid green; */

    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
```



##### Events oriented programming and modularization

Here's an example of how events have been used and how they represent the entry point for other function calls.

```javascript
setEvents = function () {
        changeAddress.addEventListener("click", () => {
            modalRender("Inserisci nuovo indirizzo, codice postale e paese",
                        "Address", "Indirizzo", "Codice postale", "Paese");
        })

        changePayment.addEventListener("click", () => {
            modalRender("Inserisci nuovo metodo di pagamento",
                        "Payment", "Card Number", "Expiration Date", "Secret number");
        })

        changeEmail.addEventListener("click", () => {
            modalRender("Inserisci nuova email",
                        "Email", "Inserisci vecchia email", "Inserisci nuova email", "Inserisci nuova email");
        })

        changePassword.addEventListener("click", () => {
            modalRender("Inserisci nuova password",
                        "Password", "Inserisci vecchia password", "Inserisci di nuovo vecchia password", "Inserisci nuova password");
        })

        signOut.addEventListener("click", () => {
            window.localStorage.setItem("auth", JSON.stringify({accessToken: ""}));
            window.location.href = "signin.html";
        })
    }
```



##### Fetch API and protected routes

Fetch API is our main way to send request towards the server. I have developed reliable routes and endpoints for assuring safe response, like the **auth/protected/** and **auth/protected/password/**.

```javascript
if(userOn) {
    window.localStorage.setItem("userCart", JSON.stringify(new_cart));
    console.log(JSON.parse(window.localStorage.getItem("userCart")));
    fetch("http://localhost:3000/api/auth/protected/update", {
    method: "PATCH",
    headers: {
        "Authorization": `Bearer ${auth.accessToken}`,
        "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify({cart: new_cart})
    })
    .then(response => response.json())
    .then(result => {console.log(result.type);})
} else {
    window.localStorage.setItem("cart", JSON.stringify(new_cart));
    console.log(JSON.parse(window.localStorage.getItem("cart")));
}
updateSumUpData(new_cart);
```



##### AccessToken and vulnerability

To keep the **Access Token** sent from the back-end from every login, I decided to use the **local storage** memory of the browser; it helped me in writing clear and easier code for the management of the token, but it also put the user in danger of XSS attack. I decided not to implement cookies for simplifying the code and avoid CSRF attacks, over than XSS ones.



------

### Now, take a look yourself!

#### Start the server using the command "npm start" in backend directory and open the site on your localhost.

#### 

## Author

Giovanni Campo