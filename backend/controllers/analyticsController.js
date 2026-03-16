import Tenant from "../models/Tenant.js";
import { processAnalytics } from "../services/analyticsService.js";

export const receiveAnalytics = async (req, res) => {
  try {

    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ message: "API key missing" });
    }

    // Find tenant using API key
    const tenant = await Tenant.findOne({ apiKey });

    if (!tenant) {
      return res.status(401).json({ message: "Invalid API key" });
    }

    const { endpoint, method, statusCode, responseTime } = req.body;

    if (!endpoint || !method || !statusCode || !responseTime) {
      return res.status(400).json({ message: "Missing analytics data" });
    }

    // Send to service
    await processAnalytics({
      tenantId: tenant._id,
      endpoint,
      method,
      statusCode,
      responseTime,
      ip: req.ip
    });

    res.status(200).json({
      message: "Analytics recorded"
    });

  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};