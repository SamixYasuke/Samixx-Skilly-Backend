import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateJwt = (user, options = {}) => {
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    throw new Error("JWT_SECRET_KEY not found in environment variables");
  }

  const payload = {
    userId: user._id,
  };

  const defaultOptions = {
    expiresIn: "48h",
  };

  const signOptions = { ...defaultOptions, ...options };

  const token = jwt.sign(payload, secretKey, signOptions);
  return token;
};

export default generateJwt;
