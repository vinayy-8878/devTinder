const mongoose = require("mongoose");
const validator = require("validator");
const jwt=require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 3) {
          throw new Error("Enter a valid name with at least 3 characters");
        } else if (value.length > 30) {
          throw new Error("Enter a valid name with maximum 30 characters");
        }
      },
    },
    lastName: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 3) {
          throw new Error("Enter a valid name with at least 3 characters");
        } else if (value.length > 30) {
          throw new Error("Enter a valid name with maximum 30 characters");
        }
      },
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter a valid email.");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      min: [18, "Age must be at least 18 years."],
    },
    gender: {
      type: String,
      trim: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Please enter valid gender");
        }
      },
    },
    skills: {
      type: [String],
      default: [],
    },
    photoUrl:{
      type: String,
      default:"https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL.");
        }
      },
    },
    about:{
      type:String,
      default:"I am a new user."
    }
  },
  { timestamps: true }
);
userSchema.methods.getJWT=async function(){
  const user=this;
  const token=await jwt.sign({_id:user._id},"Vinay8878@",{expiresIn:"1h"});
  return token;
}
userSchema.methods.validatePassword=async function(password){
  const user=this;
  const isPasswordValid=await bcrypt.compare(password, user.password);
  return isPasswordValid;
}
module.exports = mongoose.model("User", userSchema);
