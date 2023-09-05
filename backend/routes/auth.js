const express = require("express");
const router = express.Router();
const { hash } = require("bcryptjs");
// importing the user model
const User = require("../models/user");

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
    // 3. save the user to the database
    await newUser.save();
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

const { compare } = require("bcryptjs");

// importing the helper functions
const {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken,
  } = require("../utils/token");

// Sign In request
router.post("/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      // 1. check if user exists
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
    } catch (error) {
      res.status(500).json({
        type: "error",
        message: "Error signing in!",
        error,
      });
    }
});

// Sign Out request
router.post("/logout", (_req, res) => {
    // clear cookies
    res.clearCookie("refreshtoken");
    return res.json({
      message: "Logged out successfully! 🤗",
      type: "success",
    });
});

const { verify } = require("jsonwebtoken");

router.post("/refresh_token", async (req, res) => {
    try {
      const { refreshtoken } = req.cookies;
      // if we don't have a refresh token, return error
      if (!refreshtoken)
        return res.status(500).json({
          message: "No refresh token! 🤔",
          type: "error",
        });
      // if we have a refresh token, you have to verify it
      let id;
      try {
        id = verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET).id;
      } catch (error) {
        return res.status(500).json({
          message: "Invalid refresh token! 🤔",
          type: "error",
        });
      }
      // if the refresh token is invalid, return error
      if (!id)
        return res.status(500).json({
          message: "Invalid refresh token! 🤔",
          type: "error",
        });
      // if the refresh token is valid, check if the user exists
      const user = await User.findById(id);
      // if the user doesn't exist, return error
      if (!user)
        return res.status(500).json({
          message: "User doesn't exist! 😢",
          type: "error",
        });
      // if the user exists, check if the refresh token is correct. return error if it is incorrect.
      if (user.refreshtoken !== refreshtoken)
        return res.status(500).json({
          message: "Invalid refresh token! 🤔",
          type: "error",
        });
      // if the refresh token is correct, create the new tokens
      const accessToken = createAccessToken(user._id);
      const refreshToken = createRefreshToken(user._id);
      // update the refresh token in the database
      user.refreshtoken = refreshToken;
      // send the new tokes as response
      sendRefreshToken(res, refreshToken);
      return res.json({
        message: "Refreshed successfully! 🤗",
        type: "success",
        accessToken,
      });
    } catch (error) {
      res.status(500).json({
        type: "error",
        message: "Error refreshing token!",
        error,
      });
    }
  });

const { protected } = require("../utils/protected");
// protected route
router.get("/protected", protected, async (req, res) => {
  try {
    // if user exists in the request, send the data
    if (req.user)
      return res.json({
        message: "You are logged in! 🤗",
        type: "success",
        user: req.user,
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

//Update by ID Method
router.patch('/protected/update', protected, async (req, res) => {
  try {
    let result = {};
      // if user exists in the request, send the data
      if (req.user) {
        result = await User.findByIdAndUpdate(
          req.user.id, req.body, {new: false}
        )
        const _user = await User.findById(req.user.id);
        const toSend = {
          type: "success",
          user: _user
        }
        res.send(toSend);
      }
  }
  catch (error) {
      res.status(400).json({ 
        message: error.message,
        type: "error",
        message: "Error"
      })
  }
})

//Update by ID Method password
router.patch('/protected/update/password', protected, async (req, res) => {
  try {
    const { oldpassword, newpassword} = req.body;
    const isMatch = await compare(oldpassword, req.user.password);
    const passwordHash = await hash(newpassword, 10);
  
    // if password is incorrect, return error
    if (!isMatch)
      return res.status(500).json({
        message: "La password non è corretta! ⚠️",
        type: "error_pass",
      });
    
    let result = {};
      // if user exists in the request, send the data
      if (req.user) {
        result = await User.findByIdAndUpdate(
          req.user.id, {password: passwordHash}, {new: false}
        )
        const _user = await User.findById(req.user.id);
        const toSend = {
          type: "success",
          user: _user
        }
        res.send(toSend);
      }
  }
  catch (error) {
      res.status(400).json({ 
        message: error.message,
        type: "error",
        message: "Error"
      })
  }
})


  

module.exports = router;