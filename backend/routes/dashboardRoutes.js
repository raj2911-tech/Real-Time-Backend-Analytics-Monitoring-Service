import express from "express";
import { getOverviewMetrics,getTopEndpoints,getErrorAnalytics,getRecentRequests,getProfile,userManagement, addUser, deleteUser } from "../controllers/dashboardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/overview", authMiddleware, getOverviewMetrics);
router.get("/top-endpoints", authMiddleware, getTopEndpoints);
router.get("/errors", authMiddleware, getErrorAnalytics);
router.get("/recent-requests", authMiddleware, getRecentRequests);
router.get("/profile", authMiddleware, getProfile);
router.get("/user-management", authMiddleware, userManagement);
router.post("/user-management/add", authMiddleware, addUser);
router.post("/user-management/delete/:id", authMiddleware, deleteUser);




export default router;