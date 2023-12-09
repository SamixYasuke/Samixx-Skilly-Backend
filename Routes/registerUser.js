import express from "express";
import User from "../Schemas/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendConfirmationMail from "../Email Handler/sendSignUpConfirmation.js";
import sendUserEmailVerification from "../Email Handler/sendUserEmailVerification.js";
import verifyJwt from "../middlewares/verifyJwt.js";
import { handleUser } from "../utilities/makeDBRequest.js";
import passCodeGenerator from "../utilities/passCodeGenerator.js";
import sendEmailVerifiedWithSuccess from "../Email Handler/sendEmailVerifiedWithSuccess.js";

const route = express.Router();

route.post("/", async (req, res) => {
  try {
    const userDetails = {
      firstName: req.body.firstName,
      secondName: req.body.secondName,
      bio: req.body.bio,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      profilePicture: req.body.profilePicture,
      phoneNumber: req.body.phoneNumber,
      verifiedUserEmail: false,
    };

    const userEmailExists = await User.findOne({ email: userDetails.email });
    if (userEmailExists !== null) {
      return res.status(400).json({
        message: "A user already exists with this email address",
      });
    }

    const user = new User(userDetails);
    await user.save();

    const token = jwt.sign(
      { email: userDetails.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "5m",
      }
    );

    await sendConfirmationMail(
      userDetails.email,
      `${userDetails.firstName} ${userDetails.secondName}`,
      userDetails.firstName,
      userDetails.secondName,
      token
    );

    res.status(201).json({
      message: "You've been registered successfully",
    });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    res.status(500).json({
      message: `An error occurred: ${error.message}`,
    });
  }
});

route.post("/send-email-verify-code", verifyJwt, async (req, res) => {
  try {
    const userID = req.user.userId;
    const userDetails = await handleUser(userID);
    const userEmail = userDetails.email;
    const userName = `${userDetails.firstName} ${userDetails.secondName}`;
    const passCode = passCodeGenerator();
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000);
    await User.findOneAndUpdate(
      { email: userEmail },
      {
        $set: {
          passCode: passCode,
          passCodeExpiration: expirationTime,
          passCodeUsed: false,
        },
      }
    );
    await sendUserEmailVerification(userEmail, userName, passCode);
    res.json({
      message: `Password for email verification successfully sent to ${userEmail}`,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

route.patch("/verify-user/:passCode", verifyJwt, async (req, res) => {
  try {
    const userID = req.user.userId;
    const { passCode } = req.params;
    const userDetails = await handleUser(userID);
    const userName = `${userDetails.firstName} ${userDetails.secondName}`;
    const userEmail = userDetails.email;
    const user = await User.findOne({
      email: userEmail,
      passCode: passCode,
      passCodeExpiration: { $gt: new Date() },
      passCodeUsed: false,
    });
    if (user === null) {
      return res.status(401).json({
        message: "Invalid or expired passCode",
      });
    }
    user.passCodeUsed = true;
    user.verifiedUserEmail = true;
    await user.save();
    await sendEmailVerifiedWithSuccess(userEmail, userName);
    res.json({
      message: "Code verified successfully",
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default route;
