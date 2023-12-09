import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    verifiedUserEmail: {
      type: Boolean,
      required: true,
    },
    passCode: {
      type: Number,
    },
    passCodeExpiration: {
      type: Date,
    },
    passCodeUsed: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

export default User;
