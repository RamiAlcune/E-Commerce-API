"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachCookiesResponse = exports.isTokenValid = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateToken = async (payload) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is missing");
    }
    if (!process.env.JWT_LIFETIME) {
        throw new Error("JWT_LIFETIME environment variable is missing");
    }
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};
exports.generateToken = generateToken;
const isTokenValid = (token) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not set");
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    return decoded.payload;
};
exports.isTokenValid = isTokenValid;
const attachCookiesResponse = async ({ res, user }) => {
    const token = await (0, exports.generateToken)({ payload: user });
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: true,
        signed: true,
    });
    // res.status(201).json({ msg: "Registration Successful!", status: true });
};
exports.attachCookiesResponse = attachCookiesResponse;
