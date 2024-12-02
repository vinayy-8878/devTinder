const mongoose = require("mongoose");
const validator = require("validator");
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
      min: 18,
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
      default: ["Hello"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
