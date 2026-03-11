import mongoose from "mongoose";

const requestLogSchema = new mongoose.Schema(
  {
    tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
    },
    
    endpoint: {
      type: String,
      required: true
    },

    method: {
      type: String,
      required: true
    },

    statusCode: {
      type: Number,
      required: true
    },

    responseTime: {
      type: Number,
      required: true
    },

    ip: {
      type: String
    },

    timestamp: {
      type: Date,
      default: Date.now
    }
  }
);

const RequestLog = mongoose.model("RequestLog", requestLogSchema);

export default RequestLog;