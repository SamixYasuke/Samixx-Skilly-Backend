import Request from "../Schemas/serviceRequestSchema.js";
import Service from "../Schemas/serviceSchema.js";
import User from "../Schemas/userSchema.js";
import ServiceComplete from "../Schemas/userServiceCompletionSchema.js";

const handleUser = async (userId) => {
  try {
    const getUserDetails = await User.findById(userId);
    return getUserDetails;
  } catch (error) {
    throw Error("An Error Occured Couldn't get User");
  }
};

const handleRequest = async (requestId) => {
  try {
    const getRequestDetails = await Request.findById(requestId);
    return getRequestDetails;
  } catch (error) {
    throw Error("An Error Occured!!!");
  }
};

const handleService = async (serviceId) => {
  try {
    const getServiceDetails = await Service.findById(serviceId);
    return getServiceDetails;
  } catch (error) {
    throw Error("An Error Occured!!!");
  }
};

const handleServiceComplete = async (serviceCompleteId) => {
  try {
    const getServiceCompleteDetails = await ServiceComplete.findById(
      serviceCompleteId
    );
    return getServiceCompleteDetails;
  } catch (error) {
    throw Error("An Error Occured!!!");
  }
};

export { handleUser, handleRequest, handleService, handleServiceComplete };
