const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const { signUpValidation, loginValidation } = require("./utils/validate");
const {userAuth}=require("./utils/userAuth");
const cookie=require("cookie-parser");
const jwt=require("jsonwebtoken")
const app = express();
const User = require("./models/user");
app.use(express.json());
app.use(cookie());
app.post("/signup", async (req, res) => {
  try {
    signUpValidation(req);
    const { firstName, lastName, gender, age, emailId, skills, password } =
      req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
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
app.post("/login", async (req, res) => {
  try {
    loginValidation(req);
    const { emailId, password } = req.body;

    const user = await User.findOne({
      emailId,
    });
    if (!user) {
      throw new Error("User does not exist.");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token=await jwt.sign({_id:user._id,email:emailId},"Vinay8878@",{expiresIn:"1h"})
      res.cookie("token",token);
      res.send("Login Success.");
    } else {
      throw new Error("Invalid credentials.");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});
app.get("/profile", userAuth, (req, res) => {
 
  const user = req.user;
  res.json({ message: "Profile fetched successfully", user });
});

app.get("/user", async (req, res) => {
  const userId = req.body.userid;
  const user = await User.findById(userId);
  try {
    res.send(user);
  } catch (err) {
    res.status(400).send("User not added");
  }
});
app.delete("/user", async (req, res) => {
  const userId = req.body.userid;
  const user = await User.findByIdAndDelete(userId);
  try {
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("User not deleted");
  }
});
app.patch("/user/:userid", async (req, res) => {
  const userId = req.params?.userid;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "userid",
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
    ];
    if (data.email || data.password) {
      throw new Error("Cannot change email and password.");
    } else if (data?.skills.length > 10) {
      throw new Error("Can add maximum of 10 skills.");
    }
    const invalidFields = Object.keys(data).filter(
      (key) => !ALLOWED_UPDATES.includes(key)
    );

    // If there are any invalid fields, throw an error
    if (invalidFields.length > 0) {
      throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("User not updated" + err.message);
  }
});
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("server started successfully");
    });
  })
  .catch((err) => {
    console.log("connection to database failed");
  });
