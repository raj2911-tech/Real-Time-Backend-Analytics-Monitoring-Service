import RequestLog from "../models/RequestLog.js";
import AggregatedMetric from "../models/AggregatedMetric.js";

export const processAnalytics = async ({
  tenantId,
  endpoint,
  method,
  statusCode,
  responseTime,
  ip
}) => {

  // Store raw request log
  await RequestLog.create({
    tenantId,
    endpoint,
    method,
    statusCode,
    responseTime,
    ip
  });

  // Find aggregated metric
  let metric = await AggregatedMetric.findOne({
    tenantId,
    endpoint,
    method
  });

  const isError = statusCode >= 400;

  if (!metric) {

    // First request for this endpoint
    await AggregatedMetric.create({
      tenantId,
      endpoint,
      method,
      totalRequests: 1,
      avgResponseTime: responseTime,
      errorCount: isError ? 1 : 0
    });

  } else {

    const oldAvg = metric.avgResponseTime;
    const oldCount = metric.totalRequests;

    const newCount = oldCount + 1;

    const newAvg =
      ((oldAvg * oldCount) + responseTime) / newCount;

    metric.totalRequests = newCount;
    metric.avgResponseTime = newAvg;

    if (isError) {
      metric.errorCount += 1;
    }

    metric.lastUpdated = new Date();

    await metric.save();
  }
};