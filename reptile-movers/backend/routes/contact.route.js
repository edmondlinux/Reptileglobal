
import { Router } from "express";
import EmailService from "../lib/emailService.js";

const router = Router();

router.post("/send", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format" 
      });
    }

    const emailService = new EmailService();

    // Send email to admin
    const result = await emailService.sendContactFormEmail({
      name,
      email,
      subject,
      message
    });

    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: "Message sent successfully" 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: "Failed to send message" 
      });
    }
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

export default router;
