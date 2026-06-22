import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "first name IS REQUIRED"],
  },
  lastName: {
    type: String,
    required: [true, "first name IS REQUIRED"],
  },
  email: {
    type: String,
    unique: true,
    validate: [validator.isEmail, "email must follow correct scehma"],
    required: [true, "EMAIL IS REQUIRED"],
  },
  password: {
    type: String,
    required: [true, "PASSWORD IS REQUIRED"],
    select: false,
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    // required: true,
    minLength: 8,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "passwords are not matched",
    },
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: [true, "gender IS REQUIRED"],
  },
  nationality: {
    type: String,
    required: [true, "YOU MUST ENTER YOUR NATIONALITY"],
  },
  city: {
    type: String,
    required: [true, "YOU MUST ENTER YOUR CITY"],
  },
  datOfBirth: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

userSchema.methods.comparePassowrds = async function (
  currentPassord,
  userPassword,
) {
  return await bcrypt.compare(currentPassord, userPassword);
};

const User = mongoose.model("User", userSchema);
export default User;
