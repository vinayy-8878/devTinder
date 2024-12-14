const express = require("express");
const profileRouter = express.Router();
const validator = require("validator");
const User = require("../models/user");
const { userAuth } = require("../utils/userAuth");

const { validateEditProfileData } = require("../utils/validate");
profileRouter.get("/profile/view", userAuth, (req, res) => {
  const user = req.user;
  res.json({ message: "Profile fetched successfully", user });
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;
    // Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    //   if(req.body.emailId && !validator.isEmail(req.body.emailId) ){
    //     throw new Error("Please enter a valid email.")
    // }
    // await loggedInUser.save();
    await User.findOneAndUpdate(loggedInUser._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.send({
      message: `${loggedInUser.firstName} , your profile updated successfully.`,
      data: loggedInUser,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => error.message);
      res.status(400).send({ error: "Validation failed", details: errors });
    } else {
      res.status(400).send(err.message);
    }
  }
});
profileRouter.patch("/profile/resetPassword", userAuth, async (req, res) => {
  try {
    if (!validateEditedPassword(req)) {
      throw new Error("Invalid edit password request");
    }
    const loggedInUser = req.user;

    await User.findOneAndUpdate(loggedInUser._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.send({
      message: `${loggedInUser.firstName} , your password has been successfully.`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});
module.exports = profileRouter;
