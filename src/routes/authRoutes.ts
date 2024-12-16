import express from "express";
import { login, register, logout, verifyEmail, forgetPassword, resetPassword, isCookiesHere } from "../controllers/authController";
import { authenticateUser } from "../middlewares/authorazition";
const AuthRoutes = express.Router();

AuthRoutes.post("/verify-email", verifyEmail);
AuthRoutes.post("/register", register);
AuthRoutes.post("/login", login);
AuthRoutes.delete("/logout", authenticateUser, logout);
AuthRoutes.post("/forget-password", forgetPassword);
AuthRoutes.post("/reset-password", resetPassword);
AuthRoutes.get("/is-cookies-available", isCookiesHere);
export default AuthRoutes;
