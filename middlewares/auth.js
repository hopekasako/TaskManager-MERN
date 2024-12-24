const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config(); // Load environment variables

const { ACCESS_TOKEN_SECRET } = process.env;

exports.verifyAccessToken = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        let token = req.header("Authorization");
        if (!token) {
            return res.status(400).json({ status: false, msg: "Token not found" });
        }

        // Remove 'Bearer ' prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
        }

        // Verify token
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

        // Find user in database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ status: false, msg: "User not found" });
        }

        // Attach user information to the request object
        req.user = user;
        next();
    } catch (err) {
        // Handle specific JWT errors
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ status: false, msg: "Token expired" });
        }
        return res.status(401).json({ status: false, msg: "Invalid token" });
    }
};
