import express from "express";
import connectDB from "./utilities/connectDB.js";
import registerRoute from "./Routes/registerUser.js";
import loginRoute from "./Routes/loginUser.js";
import serviceRoute from "./Routes/service.js";
import serviceRequestRoute from "./Routes/serviceRequest.js";
import deleteUserRoute from "./Routes/deleteUser.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/service", serviceRoute);
app.use("/servicerequest", serviceRequestRoute);
app.use("/deleteuser", deleteUserRoute);

connectDB(app);
