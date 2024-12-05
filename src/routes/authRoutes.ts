import express from "express";
import { login, register, logout } from "../controllers/authController";

const AuthRoutes = express.Router();

AuthRoutes.post("/register", register).post("/login", login).get("/logout", logout);

export default AuthRoutes;
