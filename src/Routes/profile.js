const express = require("express");
const profileRouter = express.Router();
const validator = require("validator");
const User = require("../models/user");
const { userAuth } = require("../utils/userAuth");
const jwt=require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Both old password and new password are required."
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters long."
      });
    }

    const loggedInUser = req.user;

    // Fetch user from database
    const user = await User.findById(loggedInUser._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect."
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: `${user.firstName}, your password has been successfully reset.`
    });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "An error occurred while resetting your password." });
  }
});

module.exports = profileRouter;
