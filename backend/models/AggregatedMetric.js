import mongoose from "mongoose";

const aggregatedMetricSchema = new mongoose.Schema(
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

    totalRequests: {
      type: Number,
      default: 0
    },

    avgResponseTime: {
      type: Number,
      default: 0
    },

    errorCount: {
      type: Number,
      default: 0
    },

    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
);

const AggregatedMetric = mongoose.model(
  "AggregatedMetric",
  aggregatedMetricSchema
);

export default AggregatedMetric;