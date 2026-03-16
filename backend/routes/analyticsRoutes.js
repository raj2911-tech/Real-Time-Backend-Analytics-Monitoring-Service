import express from "express";
import { receiveAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

// POST /api/analytics
router.post("/", receiveAnalytics);

export default router;