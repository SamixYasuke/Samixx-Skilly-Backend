import bcrypt from "bcrypt";
import express from "express";
import User from "../Schemas/userSchema.js";
import generateJwt from "../utilities/generateJwt.js";
import passCodeGenerator from "../utilities/passCodeGenerator.js";
import sendPasswordResetSuccess from "../Email Handler/sendPasswordResetSucess.js";
import sendPasswordResetEmail from "../Email Handler/sendPasswordResetEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userExists = await User.findOne({ email: email });
    if (userExists === null) {
      return res.status(404).json({
        message: "No User Exists With The Email",
      });
    }
    const getPassword = userExists.password;
    const passwordIsCorrect = await bcrypt.compare(password, getPassword);
    if (passwordIsCorrect === false) {
      res.status(400).json({
        message: "You've Provided An Invalid Password",
      });
    }
    const getUserId = userExists._id;
    res.status(200).json({
      message: "Login Successful",
      token: generateJwt(getUserId),
    });
  } catch (error) {
    console.log(`An Error Occured: ${error}`);
    res.json({
      message: `An error occured ${error}`,
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const email = req.body.email;
    const getUserDetails = await User.findOne({ email: email });
    if (getUserDetails === null) {
      return res.status(401).json({
        message: "User with the email you provided doesn't exist",
      });
    }
    const userName = `${getUserDetails.firstName} ${getUserDetails.secondName}`;
    const passCode = passCodeGenerator();
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000);
    await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          passCode: passCode,
          passCodeExpiration: expirationTime,
          passCodeUsed: false,
        },
      }
    );
    await sendPasswordResetEmail(email, userName, passCode);
    res.json({
      message: `Password Reset Code successfully sent to ${email}`,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

router.post("/verify-code", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({
      email: email,
      passCode: req.body.passCode,
      passCodeExpiration: { $gt: new Date() }, // Check if passCodeExpiration is in the future
      passCodeUsed: false, // Check if the passCode has not been used
    });
    if (user === null) {
      return res.status(401).json({
        message: "Invalid or expired passCode",
      });
    }
    // Move the passCodeUsed update inside the if block
    user.passCodeUsed = true;
    await user.save();
    res.json({
      message: "Code verified successfully",
    });
  } catch (error) {
    console.error("Error during passcode verification:", error);
    res.status(500).json({
      error: "Error during passcode verification",
    });
  }
});

router.patch("/change-password", async (req, res) => {
  try {
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    const getuserDetails = await User.findOne({ email: email });
    const userName = `${getuserDetails.firstName} ${getuserDetails.secondName}`;
    getuserDetails.password = await bcrypt.hash(newPassword, 10);
    await getuserDetails.save();
    await sendPasswordResetSuccess(email, userName);
    res.status(200).json({
      message: "Password Has been changed Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

export default router;
