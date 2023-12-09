import mongoose from "mongoose";

const userServiceCompletionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    mailContent: {
      type: String,
      required: true,
    },
    serviceComplete: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceComplete = mongoose.model(
  "ServiceComplete",
  userServiceCompletionSchema
);

export default ServiceComplete;
