import express from "express";
import { getIssues, createIssue, getNotifications } from "../controllers/issueController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getIssues);
router.post("/", authenticate, createIssue);
router.get("/notifications", authenticate, getNotifications);

export default router;
