const express = require("express");
const router = express.Router();
const { hash } = require("bcryptjs");
// importing the user model
const User = require("../models/user");
const Cart = require("../models/cart");
const {allowLogged, allowAdmin} = require("../middlewares/users");
const { compare } = require("bcryptjs");
const { verify } = require("jsonwebtoken");


// Sign Up request
router.post("/signup", async (req, res) => {
  try {
    const { name,surname,email, password } = req.body;
    // 1. check if user already exists
    const user = await User.findOne({ email: email });

    // if user exists already, return error
    if (user)
      return res.status(500).json({
        message: "Utente già esistente! Prova ad accedere. 😄",
        type: "warning",
      });
    // 2. if user doesn't exist, create a new user
    // hashing the password
    const passwordHash = await hash(password, 10);
    const newUser = new User({
      name: name,
      surname: surname,
      email: email,
      password: passwordHash,
      deliveryInfo: {
        address: "",
        postalCode: "",
        country: ""
      },
      paymentCard: {
        numberCard: "",
        expirationDate: "",
        pass: ""
      }
    });

    const newCart = new Cart({
      userID: newUser._id,
      products: []
    })

    // 3. save the user to the database
    await newUser.save();
    await newCart.save();
    
    // 4. send the response
    res.status(200).json({
      message: `Complimenti ${newUser.name}, hai creato il tuo profilo! 🥳`,
      type: "success",
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error creating user!",
      error,
    });
  }
});

// Sign In request
router.post("/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      // console.log(email,password);
      // 1. check if user exists
      const user = await User.findOne({ email: email});
  
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
      await user.save();

      req.session.user = user;
      session = req.session;
      req.session.save(); 

      // console.log(req.session);

      res.status(200).send({
        type: "success",
        message: "User correctly logged in!",
        session: session
      })
  
    } catch (error) {
      res.status(500).json({
        type: "error",
        message: "Error signing in!",
        error,
      });
    }
});

// Sign In request
router.post("/signin/admin", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email,password);
    // 1. check if user exists
    const user = await User.findOne({ email: email});

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
    await user.save();

    if(user.level !== "admin")
      return res.status(401).json({
        message: "Accesso consentito solo agli admin! ⚠️",
        type: "error",
      });

    req.session.user = user;
    session = req.session;
    req.session.save(); 

    // console.log(req.session);

    res.status(200).send({
      type: "success",
      message: "User correctly logged in!",
      session: session
    })

  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error signing in!",
      error,
    });
  }
});

// Sign Out request
router.post("/logout", (req, res) => {
    // clear cookies
    req.session.destroy();
    // res.redirect('signin.html');
    res.status(200).json({
      type: "success"
    })
});

// protected route
router.get("/me", allowLogged, async (req, res) => {
  try {
    // if user exists in the request, send the data
    // console.log(req.session);

    if (req.session.user)
      return res.status(200).json({
        message: "You are logged in! 🤗",
        type: "success",
        user: req.session.user,
      });
    // if user doesn't exist, return error
    return res.status(500).json({
      message: "You are not logged in! 😢",
      type: "error",
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error getting protected route!",
      error,
    });
  }
});

// getAll users
router.get("/getAll", allowAdmin, async (req,res) => {
  try{
      const data = await User.find();
      res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
})

router.get("/getById/:id", allowAdmin, async (req,res) => {
  try{
    const data = await User.findById(req.params.id);
    res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
})

//Update by ID Method
router.patch('/update', allowLogged, async (req, res) => {
  try {
    // console.log(req.session.user, req.body);
    let result = {};
      // if user exists in the request, send the data
      if (req.session.user) {
        // console.log(req.session.user, req.body);
        result = await User.findByIdAndUpdate(
          req.session.user._id, req.body, {new: false}
        )
        const _user = await User.findById(req.session.user._id);
        const toSend = {
          type: "success",
          user: _user
        }
        req.session.user = _user;
        req.session.save();
        res.send(toSend);
      }
  }
  catch (error) {
    // console.log(req.session.user);
      res.status(500).json({ 
        message: error.message,
        type: "error",
      })
  }
})

//Update by ID Method password
router.patch('/update/password', allowLogged, async (req, res) => {
  try {
    const { oldpassword, newpassword} = req.body;
    const isMatch = await compare(oldpassword, req.session.user.password);
    const passwordHash = await hash(newpassword, 10);
  
    // if password is incorrect, return error
    if (!isMatch)
      return res.status(500).json({
        message: "La password non è corretta! ⚠️",
        type: "error_pass",
      });
    
    let result = {};
      // if user exists in the request, send the data
      if (req.session.user) {
        result = await User.findByIdAndUpdate(
          req.session.user._id, {password: passwordHash}, {new: false}
        )
        const _user = await User.findById(req.session.user._id);
        const toSend = {
          type: "success",
          user: _user
        }
        req.session.user = _user;
        req.session.save();
        res.send(toSend);
      }
  }
  catch (error) {
      res.status(400).json({ 
        message: error.message,
        type: "error"
      })
  }
})


  

module.exports = router;