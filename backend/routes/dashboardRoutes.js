import express from "express";
import { getOverviewMetrics,getTopEndpoints,getErrorAnalytics,getRecentRequests } from "../controllers/dashboardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/overview", authMiddleware, getOverviewMetrics);
router.get("/top-endpoints", authMiddleware, getTopEndpoints);
router.get("/errors", authMiddleware, getErrorAnalytics);
router.get("/recent-requests", authMiddleware, getRecentRequests);

export default router;