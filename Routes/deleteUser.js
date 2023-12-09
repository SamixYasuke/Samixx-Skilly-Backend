import express from "express";
import User from "../Schemas/userSchema.js";
import verifyJwt from "../middlewares/verifyJwt.js";
import bcrypt from "bcrypt";
import { handleUser } from "../utilities/makeDBRequest.js";

const router = express.Router();

router.delete("/", verifyJwt, async (req, res) => {
  try {
    const userID = req.user.userId;
    const userEnteredPassword = req.body.password;
    const getUserAccount = await handleUser(userID);
    const getuserPassword = getUserAccount.password;
    const comparePassword = await bcrypt.compare(
      userEnteredPassword,
      getuserPassword
    );
    if (!comparePassword) {
      return res.status(401).json({
        message: "you've provided a wrong password!!",
      });
    }
    await User.findByIdAndDelete(userID);
    res.status(204).json({
      message: "You've successfully deleted the account",
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

export default router;
