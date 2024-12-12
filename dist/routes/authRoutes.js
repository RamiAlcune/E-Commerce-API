"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const AuthRoutes = express_1.default.Router();
AuthRoutes.post("/verify-email", authController_1.verifyEmail);
AuthRoutes.post("/register", authController_1.register);
AuthRoutes.post("/login", authController_1.login);
AuthRoutes.get("/logout", authController_1.logout);
exports.default = AuthRoutes;
