import jwt from "jsonwebtoken";

const verifyJwt = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please reauthenticate." });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default verifyJwt;
