"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizePermissions = exports.authenticateUser = void 0;
const jwt_1 = require("../utils/jwt");
const unauthenticated_1 = require("../errors/unauthenticated");
const unauthorized_1 = require("../errors/unauthorized");
const tokenModel_1 = require("../models/tokenModel");
const jwt_2 = require("../utils/jwt");
const authenticateUser = async (req, res, next) => {
    const { refreshToken, accsesToken } = req.signedCookies;
    try {
        if (accsesToken) {
            const payload = (0, jwt_1.isTokenValid)(accsesToken);
            req.user = payload;
            return next();
        }
        //Refresh Token
        const payload = (0, jwt_1.isTokenValid)(refreshToken);
        const existingToken = await (0, tokenModel_1.getTokenByUserID)(payload.id, refreshToken);
        if (!existingToken || !existingToken?.isValid) {
            throw new unauthenticated_1.UnauthenticatedError("Authentication Invalid");
        }
        (0, jwt_2.attachCookiesResponse)({ res, user: payload.id, refresh_token: existingToken.refresh_token });
        req.user = payload;
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
