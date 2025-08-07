import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import kycRoutes from "./routes/kyc.route.js";
import shipmentRoutes from "./routes/shipment.route.js";
import contactRoutes from "./routes/contact.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" })); // allows you to parse the body of the request
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/kyc", kycRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		if (!req.path.startsWith('/api')) {
			res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
		} else {
			res.status(404).json({ message: "API route not found" });
		}
	});
}

app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
	connectDB();
});