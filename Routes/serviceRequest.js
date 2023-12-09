import express from "express";
import verifyJwt from "../middlewares/verifyJwt.js";
import Request from "../Schemas/serviceRequestSchema.js";
import ServiceComplete from "../Schemas/userServiceCompletionSchema.js";
import sendServiceRequest from "../Email Handler/sendServiceRequest.js";
import sendServiceRejectedMail from "../Email Handler/sendServiceRejectedMail.js";
import sendUserConfirmationForServiceMail from "../Email Handler/sendUserConfirmationForServiceMail.js";
import {
  handleService,
  handleUser,
  handleRequest,
} from "../utilities/makeDBRequest.js";

const router = express.Router();

router.post("/make-request/:serviceid", verifyJwt, async (req, res) => {
  try {
    const { serviceid } = req.params;
    const service = await handleService(serviceid);
    const serviceProvider = service.serviceProvider;
    const requester = req.user.userId;
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }
    const newRequest = new Request({
      service: serviceid,
      serviceProvider: serviceProvider,
      requester: requester,
    });
    await newRequest.save();
    const getServiceProviderDetails = await handleUser(
      serviceProvider.toString()
    );
    const getServiceProviderEmail = getServiceProviderDetails.email;
    const getServiceProviderName = getServiceProviderDetails.firstName;
    await sendServiceRequest(getServiceProviderEmail, getServiceProviderName);
    res.status(201).json({
      message: "Request made successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.patch("/accept-request/:requestId", verifyJwt, async (req, res) => {
  try {
    const { requestId } = req.params;
    const getRequest = await handleRequest(requestId);
    const serviceProviderId = getRequest.serviceProvider;
    if (serviceProviderId.toString() !== req.user.userId) {
      return res.status(401).json({
        message: "You're Not Authorized to change the status of this request!!",
      });
    }
    getRequest.requestStatus = "Accepted";
    await getRequest.save();
    res.status(200).json({
      message: "Request Status Updated Successfully",
    });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.patch("/reject-request/:requestId", verifyJwt, async (req, res) => {
  try {
    const { requestId } = req.params;
    const getRequest = await handleRequest(requestId);
    const serviceProviderId = getRequest.serviceProvider;
    if (serviceProviderId.toString() !== req.user.userId) {
      return res.status(401).json({
        message: "You're Not Authorized to change the status of this request!!",
      });
    }
    const getRequesterDetail = await handleUser(getRequest.requester);
    const getServiceDetail = await handleService(getRequest.service.toString());
    getRequest.requestStatus = "Rejected";
    await sendServiceRejectedMail(
      getRequesterDetail.email,
      getRequesterDetail.firstName,
      getServiceDetail.serviceName
    );
    await getRequest.save();
    res.status(200).json({
      message: "Request Status Updated Successfully",
    });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.patch("/complete-request/:requestId", verifyJwt, async (req, res) => {
  try {
    const { requestId } = req.params;
    const getRequest = await handleRequest(requestId);
    const requesterID = getRequest.requester;
    const serviceProviderId = getRequest.serviceProvider.toString();
    console.log(requesterID);
    if (serviceProviderId !== req.user.userId) {
      return res.status(401).json({
        message: "You're Not Authorized to change the status of this request!!",
      });
    }
    getRequest.requestStatus = "Partially Completed";
    const getUserDetails = await handleUser(requesterID);
    await sendUserConfirmationForServiceMail(
      getUserDetails.email,
      getUserDetails.firstName
    );
    await getRequest.save();
    res.status(200).json({
      message: `Request Status Updated Successfully, The User Would also need to 
        confirm that the request has been completed before it is fully complete`,
    });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post(
  "/user-complete-request/:requestID",
  verifyJwt,
  async (req, res) => {
    try {
      const { requestID } = req.params;
      const userResponse = req.body.userResponse;
      const getCompletionSchema = await ServiceComplete.findOne({
        requestId: requestID,
      });
      getCompletionSchema.serviceComplete = userResponse;
      await getCompletionSchema.save();
      const getrequestSchema = await handleRequest(requestID);
      if (userResponse) {
        getrequestSchema.requestStatus = "Completed";
        await getrequestSchema.save();
        console.log(getCompletionSchema);
        return res.status(200).json({
          message:
            "You've Successfully Finished The Transaction. We Hope To See You Again On Our Platform",
        });
      }
      console.log(getCompletionSchema);
      return res.status(200).json({
        message:
          "You've chosen not to complete the transaction. We'll contact the service provider and get back to you.",
      });
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

router.get("/get-pending-requests", verifyJwt, async (req, res) => {
  try {
    const userId = req.user.userId;
    const getPendingRequests = await Request.find({
      serviceProvider: userId,
      requestStatus: "Pending",
    });
    res.json({
      pendingRequests: getPendingRequests,
    });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/get-accepted-requests", verifyJwt, async (req, res) => {
  try {
    const userId = req.user.userId;
    const getPendingRequests = await Request.find({
      serviceProvider: userId,
      requestStatus: "Accepted",
    });
    res.json({
      acceptedRequests: getPendingRequests,
    });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/get-rejected-requests", verifyJwt, async (req, res) => {
  try {
    const userId = req.user.userId;
    const getPendingRequests = await Request.find({
      serviceProvider: userId,
      requestStatus: "Rejected",
    });
    res.json({
      rejectedRequests: getPendingRequests,
    });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/get-completed-requests", verifyJwt, async (req, res) => {
  try {
    const userId = req.user.userId;
    const getPendingRequests = await Request.find({
      serviceProvider: userId,
      requestStatus: "Completed",
    });
    res.json({
      completedRequests: getPendingRequests,
    });
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
