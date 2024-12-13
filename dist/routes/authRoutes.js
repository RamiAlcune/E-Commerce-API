"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authorazition_1 = require("../middlewares/authorazition");
const AuthRoutes = express_1.default.Router();
AuthRoutes.post("/verify-email", authController_1.verifyEmail);
AuthRoutes.post("/register", authController_1.register);
AuthRoutes.post("/login", authController_1.login);
AuthRoutes.delete("/logout", authorazition_1.authenticateUser, authController_1.logout);
AuthRoutes.post("/forget-password", authController_1.forgetPassword);
AuthRoutes.post("/reset-password", authController_1.resetPassword);
exports.default = AuthRoutes;
