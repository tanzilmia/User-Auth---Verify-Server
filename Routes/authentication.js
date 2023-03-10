const express = require("express");
const { default: mongoose } = require("mongoose");
const Auth = express.Router();
const userScema = require("../Scema/users");
const bycript = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = new mongoose.model("User", userScema);
require("dotenv").config();

// register user
Auth.post("/register", async (req, res) => {
  try {
    const user = req.body;
    const { name, email, password, verify } = user;
    const alreadyExist = await User.findOne({ email: email });
    const encrypetedPass = await bycript.hash(password, 10);
    if (alreadyExist) {
      res.send({ message: "User is Already Exist" });
    } else {
      const NewUser = new User({
        name,
        email,
        password: encrypetedPass,
        verify,
      });

      await NewUser.save();
      if (NewUser) {
        const token = jwt.sign(
          { email: NewUser.email },
          `${process.env.VERIFY_CODE}`
        );
        res.send({ message: "success", token: token, data: NewUser });
      } else {
        res.send({ message: "something is wrong" });
      }
    }
  } catch (e) {
    res.send({ message: "something is wrong" });
  }
});

// verify user
Auth.put("/verify-email", async (req, res) => {
  try {
    const { userid } = req.body;
    const ValidUser = await User.findOne({ _id: userid });
    if (!ValidUser) {
      return res.send({ message: "Fake Code" });
    }
    await User.updateOne(
      { _id: userid },
      {
        $set: {
          verify: true,
        },
      }
    );
    res.send({ message: "Update Complete" });
  } catch (e) {
    res.send({ message: "Fake Code" });
  }
});

// login user

Auth.post("/login", async (req, res) => {
  try {
    const user = req.body;
    const { email, password } = user;
    const validuser = await User.findOne({ email: email, verify:true });
    if (!validuser) {
      return res.send({ message: "user not Valid" });
    }

   if(validuser){
    const validPass = await bycript.compare(password, validuser.password);
    if (validPass) {
     const token = jwt.sign(
       { email: validuser.email },
       `${process.env.JWT_SECRET}`
     );
     return res.status(200).send({ message: "Login Successful", data: token });
   } else {
     return res.send({ message: "password not Match" });
   }
   }
  
  } catch (e) {}
});

// get user info

Auth.post("/user-info", async(req,res)=>{
    try {
        const { token } = req.body;
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = user.email;
        const userdata = await User.findOne({ email: userEmail });
        if (userdata) {
          res.status(200).send({ message: "successfull", data: userdata });
        } else {
          res.status(400).send({ message: "Not Valid User" });
        }
      } catch (e) {}
})

module.exports = Auth;
