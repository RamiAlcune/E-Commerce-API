"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = require("http-status-codes");
const UsersModel_1 = require("../models/UsersModel");
const jwt_1 = require("../utils/jwt");
const createTokenUser_1 = require("../utils/createTokenUser");
const register = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ msg: "All fields are required.", status: false });
        return;
    }
    const userExist = await (0, UsersModel_1.getUserByUserName)(username);
    if (userExist) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ msg: "This account has already been registered.", status: false });
        return;
    }
    const hashedPassowrd = await bcryptjs_1.default.hash(password, 10);
    const userCreated = await (0, UsersModel_1.createUser)({ username, email, password: hashedPassowrd });
    if (!userCreated.role)
        userCreated.role = "user";
    const TokenUser = (0, createTokenUser_1.createTokenUser)(userCreated);
    // const token = await generateToken({ userId: userCreated.id, user: userCreated.user });
    await (0, jwt_1.attachCookiesResponse)({ res, user: userCreated.username });
    res.status(200).json({ msg: "Registration Successful!", data: TokenUser, status: true });
};
exports.register = register;
const login = async (req, res) => {
    const userInfo = req.body;
    if (!userInfo.username || !userInfo.password || !userInfo.email) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ msg: "All fields are required.", status: false });
        return;
    }
    const userExist = await (0, UsersModel_1.getUserByUserName)(userInfo.username);
    if (!userExist) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ msg: "This account is not registered.", status: false });
        return;
    }
    const isPasswordValid = await bcryptjs_1.default.compare(userInfo.password, userExist.password);
    if (!isPasswordValid) {
        res
            .status(http_status_codes_1.StatusCodes.NOT_FOUND)
            .json({ msg: "The password you entered is incorrect. Please verify and try again.", status: false });
    }
    // const token = await generateToken(userInfo.user);
    const UserReq = (0, createTokenUser_1.createTokenUser)(userExist);
    await (0, jwt_1.attachCookiesResponse)({ res, user: UserReq });
    res.status(201).json({ msg: "You have successfully logged in", status: true });
};
exports.login = login;
const logout = async (req, res) => {
    res.cookie("token", "logout", { httpOnly: true, expires: new Date(Date.now()) });
    res.status(200).json({ status: true });
};
exports.logout = logout;
