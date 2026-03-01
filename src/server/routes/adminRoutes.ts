import express from "express";
import { getAdminIssues, updateIssueStatus, getAnalytics } from "../controllers/adminController.js";
import { authenticate, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/issues", authenticate, adminOnly, getAdminIssues);
router.patch("/issues/:id/status", authenticate, adminOnly, updateIssueStatus);
router.get("/analytics", authenticate, adminOnly, getAnalytics);

export default router;
