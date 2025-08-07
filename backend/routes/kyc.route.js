
import express from "express";
import {
  generateMagicLink,
  getCloudinarySignature,
  submitKYC,
  verifyKYC,
  getAllKYCSubmissions
} from "../controllers/kyc.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route for KYC submission
router.post("/submit", submitKYC);

// Route for getting Cloudinary signature (public for magic link users)
router.post("/cloudinary-signature", getCloudinarySignature);

// Admin only routes
router.post("/generate-magic-link", protectRoute, adminRoute, generateMagicLink);
router.get("/submissions", protectRoute, adminRoute, getAllKYCSubmissions);
router.put("/submissions/:submissionId/verify", protectRoute, adminRoute, verifyKYC);

export default router;
