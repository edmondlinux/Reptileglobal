import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	try {
		const userId = req.cookies.userId;

		if (!userId) {
			return res.status(401).json({ message: "Unauthorized - Please log in" });
		}

		const user = await User.findById(userId).select("-password");

		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		console.log("Error in protectRoute middleware", error.message);
		return res.status(401).json({ message: "Unauthorized - Invalid session" });
	}
};

export const adminRoute = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};
