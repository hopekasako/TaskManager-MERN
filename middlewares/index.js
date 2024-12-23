//middlewares.js/index.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ACCESS_TOKEN_SECRET } = process.env;


exports.verifyAccessToken = async (req, res, next) => {

    let token = req.header("Authorization");
    if (!token) return res.status(400).json({ status: false, msg: "Token not found" });

    // If there's an empty request body that shouldn't be empty, return an error
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ status: false, msg: "Empty body in request" });
    }

    let user;
    try {
        user = jwt.verify(token, ACCESS_TOKEN_SECRET);
    }
    catch (err) {
        return res.status(401).json({ status: false, msg: "Invalid token" });
    }

    try {
        user = await User.findById(user.id);
        if (!user) {
            return res.status(401).json({ status: false, msg: "User not found" });
        }

        req.user = user;
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal Server Error" });
    }
}