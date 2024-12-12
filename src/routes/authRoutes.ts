import express from "express";
import { login, register, logout, verifyEmail } from "../controllers/authController";

const AuthRoutes = express.Router();

AuthRoutes.post("/verify-email", verifyEmail);
AuthRoutes.post("/register", register);
AuthRoutes.post("/login", login);
AuthRoutes.get("/logout", logout);

export default AuthRoutes;
