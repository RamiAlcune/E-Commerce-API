"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizePermissions = exports.authenticateUser = void 0;
const jwt_1 = require("../utils/jwt");
const unauthenticated_1 = require("../errors/unauthenticated");
const unauthorized_1 = require("../errors/unauthorized");
const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    console.log(token);
    if (!token)
        throw new unauthenticated_1.UnauthenticatedError("Authentication Error");
    try {
        const decoded = (0, jwt_1.isTokenValid)(token);
        if (!decoded) {
            res.status(401).json({ msg: "Authentication Error: Invalid token" });
            return;
        }
        const { username, id, role } = decoded;
        console.log(`authenticateUser: ${id}`);
        req.user = { username, id, role };
        next();
    }
    catch (error) {
        throw new unauthenticated_1.UnauthenticatedError("Authentication Invalid");
    }
};
exports.authenticateUser = authenticateUser;
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role)) {
            throw new unauthorized_1.UnauthentizedError("Unauthorized to accses this route");
        }
        next();
    };
    // if (req.user?.role !== "admin") {
    //   throw new UnauthentizedError("Unauthorized to accses this route");
    // }
    // console.log("Admin Route!");
    // next();
};
exports.authorizePermissions = authorizePermissions;
