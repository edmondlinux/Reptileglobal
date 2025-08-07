
import mongoose from "mongoose";
import crypto from "crypto";
import cloudinary from "cloudinary";

// In-memory store for magic tokens (use Redis in production)
const magicTokens = new Map();

// KYC submission schema
const kycSubmissionSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  idImageUrl: { type: String, required: true },
  reptileImageUrl: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now },
  verifiedAt: Date,
  shipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' },
  userEmail: String,
  userName: String
});

const KYCSubmission = mongoose.model("KYCSubmission", kycSubmissionSchema);

// Generate magic link (admin only)
export const generateMagicLink = async (req, res) => {
  try {
    const { shipmentId, userEmail, userName } = req.body;
    
    if (!shipmentId || !userEmail) {
      return res.status(400).json({ message: "Shipment ID and user email are required" });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store token with metadata
    magicTokens.set(token, {
      shipmentId,
      userEmail,
      userName,
      expiresAt,
      used: false
    });

    const FrontendUrl = 'https://d9c63c6c-d418-4b35-afad-8d6af14cdd4a-00-7zha2surcz85.spock.replit.dev';

    const magicLink = `${FrontendUrl}/kyc-verification/${token}`;

    res.json({
      success: true,
      magicLink,
      token,
      expiresAt
    });
  } catch (error) {
    console.log("Error in generateMagicLink:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Generate Cloudinary signature for secure uploads
export const getCloudinarySignature = async (req, res) => {
  try {
    const { folder = "kyc-verification" } = req.body;
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Only include parameters that will be sent to Cloudinary
    const params = {
      folder,
      timestamp
    };

    const signature = cloudinary.v2.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder
    });
  } catch (error) {
    console.log("Error in getCloudinarySignature:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify token and submit KYC data
export const submitKYC = async (req, res) => {
  try {
    const { token, idImageUrl, reptileImageUrl } = req.body;

    if (!token || !idImageUrl || !reptileImageUrl) {
      return res.status(400).json({ message: "Token and both image URLs are required" });
    }

    // Verify token exists and is valid
    const tokenData = magicTokens.get(token);
    if (!tokenData) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (tokenData.used) {
      return res.status(400).json({ message: "Token has already been used" });
    }

    if (new Date() > tokenData.expiresAt) {
      magicTokens.delete(token);
      return res.status(400).json({ message: "Token has expired" });
    }

    // Check if submission already exists
    const existingSubmission = await KYCSubmission.findOne({ token });
    if (existingSubmission) {
      return res.status(400).json({ message: "KYC already submitted for this token" });
    }

    // Create KYC submission
    const kycSubmission = new KYCSubmission({
      token,
      idImageUrl,
      reptileImageUrl,
      shipmentId: tokenData.shipmentId,
      userEmail: tokenData.userEmail,
      userName: tokenData.userName
    });

    await kycSubmission.save();

    // Mark token as used
    tokenData.used = true;
    magicTokens.set(token, tokenData);

    res.status(201).json({
      success: true,
      message: "KYC verification submitted successfully",
      submissionId: kycSubmission._id
    });
  } catch (error) {
    console.log("Error in submitKYC:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify KYC submission (admin only)
export const verifyKYC = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { isVerified, notes } = req.body;

    const submission = await KYCSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "KYC submission not found" });
    }

    submission.isVerified = isVerified;
    submission.verifiedAt = new Date();
    if (notes) submission.notes = notes;

    await submission.save();

    res.json({
      success: true,
      message: `KYC ${isVerified ? 'approved' : 'rejected'} successfully`,
      submission
    });
  } catch (error) {
    console.log("Error in verifyKYC:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all KYC submissions (admin only)
export const getAllKYCSubmissions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    let query = {};
    if (status === 'pending') query.isVerified = false;
    if (status === 'verified') query.isVerified = true;

    const submissions = await KYCSubmission.find(query)
      .populate('shipmentId', 'trackingNumber')
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await KYCSubmission.countDocuments(query);

    res.json({
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.log("Error in getAllKYCSubmissions:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { KYCSubmission };
