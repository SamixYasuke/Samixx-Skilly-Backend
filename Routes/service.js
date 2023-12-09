import express from "express";
import verifyJwt from "../middlewares/verifyJwt.js";
import Service from "../Schemas/serviceSchema.js";
import { handleUser } from "../utilities/makeDBRequest.js";

const route = express.Router();

route.post("/create-service", verifyJwt, async (req, res) => {
  try {
    const {
      serviceName,
      serviceDescription,
      serviceCost,
      serviceLocation,
      serviceTag,
    } = req.body;

    const serviceProvider = req.user.userId;
    const userDetails = await handleUser(serviceProvider);
    const userIsVerified = userDetails.verifiedUserEmail;

    if (userIsVerified === false) {
      return res.status(401).json({
        message:
          "You've not verified your email address so you cannot create a service",
      });
    }

    const serviceData = {
      serviceName: serviceName,
      serviceDescription: serviceDescription,
      serviceCost: serviceCost,
      serviceLocation: serviceLocation,
      serviceProvider: serviceProvider,
      serviceTag: serviceTag,
    };

    const newService = new Service(serviceData);
    await newService.save();
    res.status(201).json({
      message: "Service created successfully",
      data: newService,
    });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

route.get("/get-services", async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: `An Error ocurred: ${error}`,
    });
  }
});

route.get("/getservice/:serviceid", async (req, res) => {
  const { serviceid } = req.params;
  try {
    const service = await handleService(serviceid);
    res.status(200).json({
      message: service,
    });
  } catch (error) {
    res.status(500).json({
      message: `An Error ocurred: ${error}`,
    });
  }
});

route.delete(
  "/deleteservice/:serviceid/:userid",
  verifyJwt,
  async (req, res) => {
    try {
      const { serviceid, userid } = req.params;
      if (req.user.userId !== userid) {
        return res.status(403).json({
          message: "Unauthorized: You are not allowed to delete this service.",
        });
      }
      const serviceToDelete = await handleService(serviceid);
      if (!serviceToDelete) {
        return res.status(404).json({ message: "Service not found." });
      }
      if (String(serviceToDelete.serviceProvider) !== userid) {
        return res.status(403).json({
          message: "Unauthorized: You are not allowed to delete this service.",
        });
      }
      await Service.findByIdAndDelete(serviceid);
      res.json({ message: "Service deleted successfully." });
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default route;
