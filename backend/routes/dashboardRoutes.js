import express from "express";
import { getOverviewMetrics,getTopEndpoints,getErrorAnalytics,getRecentRequests,getProfile } from "../controllers/dashboardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/overview", authMiddleware, getOverviewMetrics);
router.get("/top-endpoints", authMiddleware, getTopEndpoints);
router.get("/errors", authMiddleware, getErrorAnalytics);
router.get("/recent-requests", authMiddleware, getRecentRequests);
router.get("/profile", authMiddleware, getProfile);

export default router;