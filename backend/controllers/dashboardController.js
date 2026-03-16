import User from "../models/User.js";
import Tenant from "../models/Tenant.js";
import RequestLog from "../models/RequestLog.js";
import AggregatedMetric from "../models/AggregatedMetric.js";   


// @route   GET /api/dashboard/overview
export const getOverviewMetrics = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const metrics = await AggregatedMetric.find({ tenantId });

    if (!metrics.length) {
      return res.status(200).json({
        totalRequests: 0,
        avgResponseTime: 0,
        totalErrors: 0,
        errorRate: 0,
        totalEndpoints: 0
      });
    }

    let totalRequests = 0;
    let totalErrors = 0;
    let weightedResponseTime = 0;

    metrics.forEach((metric) => {
      totalRequests += metric.totalRequests;
      totalErrors += metric.errorCount;
      weightedResponseTime += metric.avgResponseTime * metric.totalRequests;
    });

    const avgResponseTime = totalRequests
      ? weightedResponseTime / totalRequests
      : 0;

    const errorRate = totalRequests
      ? (totalErrors / totalRequests) * 100
      : 0;

    const totalEndpoints = metrics.length;

    res.status(200).json({
      totalRequests,
      avgResponseTime: Math.round(avgResponseTime),
      totalErrors,
      errorRate: Number(errorRate.toFixed(2)),
      totalEndpoints
    });

  } catch (error) {
    console.error("Overview metrics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/dashboard/top-endpoints
export const getTopEndpoints = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const topEndpoints = await AggregatedMetric.find({ tenantId })
      .sort({ totalRequests: -1 })   // highest requests first
      .limit(3)                      // top 3 endpoints
      .select("endpoint method totalRequests avgResponseTime errorCount");

    res.status(200).json(topEndpoints);

  } catch (error) {
    console.error("Top endpoints error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/dashboard/errors
export const getErrorAnalytics = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const errorEndpoints = await AggregatedMetric.find({
      tenantId,
      errorCount: { $gt: 0 }
    })
      .sort({ errorCount: -1 })
      .select("endpoint method errorCount totalRequests");

    res.status(200).json(errorEndpoints);

  } catch (error) {
    console.error("Error analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/dashboard/recent-requests
export const getRecentRequests = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const recentRequests = await RequestLog.find({ tenantId })
      .sort({ timestamp: -1 }) // newest first
      .limit(20)
      .select("endpoint method statusCode responseTime timestamp");

    res.status(200).json(recentRequests);

  } catch (error) {
    console.error("Recent requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/dashboard/profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tenantId = req.user.tenantId;

    const user = await User.findById(userId).select("name email role createdAt");
    if (!user) return res.status(404).json({ message: "User not found" });

    const tenant = await Tenant.findById(tenantId).select("companyName apiKey");
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      companyName: tenant.companyName,
      apiKey: tenant.apiKey,
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};