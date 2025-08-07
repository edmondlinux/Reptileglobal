
import axios from "../lib/axios";

export const uploadToCloudinary = async (file) => {
  try {
    // Get signature from backend
    const { data: signatureData } = await axios.post("/kyc/cloudinary-signature", {
      folder: "kyc-verification"
    });

    // Prepare form data for Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signatureData.signature);
    formData.append("timestamp", signatureData.timestamp);
    formData.append("api_key", signatureData.apiKey);
    formData.append("folder", signatureData.folder);

    // Upload to Cloudinary directly
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;
    
    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Failed to upload to Cloudinary");
    }

    const result = await response.json();
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
