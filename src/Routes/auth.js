const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { signUpValidation, loginValidation } = require("../utils/validate");
authRouter.post("/signup", async (req, res) => {
  try {
    signUpValidation(req);
    const { firstName, lastName, gender, age, emailId, skills, password } =
      req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      age,
      gender,
      emailId,
      password: passwordHash,
      skills,
    });
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    loginValidation(req);
    const { emailId, password } = req.body;

    const user = await User.findOne({
      emailId,
    });
    if (!user) {
      throw new Error("User does not exist.");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Login Success.");
    } else {
      throw new Error("Invalid credentials.");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});


authRouter.post("/logout", async (req, res) => {
   res.cookie("token",null,{
    expires:new Date(Date.now())
   })
   res.send("Logout Successfull.")
  });
module.exports = authRouter;
