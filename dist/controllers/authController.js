"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = require("http-status-codes");
const UsersModel_1 = require("../models/UsersModel");
const createTokenUser_1 = require("../utils/createTokenUser");
const UsersModel_2 = require("../models/UsersModel");
const crypto_1 = __importDefault(require("crypto"));
const unauthenticated_1 = require("../errors/unauthenticated");
const sendVerficationEmail_1 = require("../utils/sendVerficationEmail");
const tokenModel_1 = require("../models/tokenModel");
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
    const verifcationToken = crypto_1.default.randomBytes(40).toString("hex");
    const verificationCode = Math.floor(10000000 + Math.random() * 90000000);
    console.log(verificationCode);
    const userCreated = await (0, UsersModel_1.createUser)({ username, email, password: hashedPassowrd, verifcationToken, verificationCode });
    const Data = {
        name: userCreated?.username,
        email: userCreated?.email,
        verifcationToken: userCreated?.verification_link,
        verificationCode: userCreated?.verification_code,
        origin: "http://localhost:5000",
    };
    await (0, sendVerficationEmail_1.sendVerifactionEmail)(Data);
    //send verif
    res.status(201).json({ msg: "Success! Please Check Your Email to verify the account.", status: true });
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
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ msg: "The password you entered is incorrect. Please verify and try again.", status: false });
    }
    if (!userExist.isVerified) {
        res.status(401).json({ msg: "Please Verify The account before trying to login.", status: false });
        return;
    }
    const UserReq = (0, createTokenUser_1.createTokenUser)(userExist);
    //create refresh Token
    let refresh_token = "";
    //check for existing Token
    refresh_token = crypto_1.default.randomBytes(40).toString("hex");
    const user_agent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { refresh_token, ip, user_agent, id_user: userExist.id };
    const token = await (0, tokenModel_1.createToken)(userToken);
    // await attachCookiesResponse({ res, user: UserReq });
    res.status(201).json({ userToken: userToken, token: token });
};
exports.login = login;
const logout = async (req, res) => {
    res.cookie("token", "logout", { httpOnly: true, expires: new Date(Date.now()) });
    res.status(200).json({ status: true });
};
exports.logout = logout;
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const { code } = req.body;
        let validEmail = req.query.email || req.body.email;
        const user = await (0, UsersModel_2.getSingleUserByEmail)(validEmail);
        if (!user) {
            throw new unauthenticated_1.UnauthenticatedError("Verification Failed, user not found");
        }
        console.log(`user ver link: ${user.verification_link}, req.query token: ${token}`);
        console.log(`user code: ${user.verification_code}, req.body code : ${code}`);
        if (user.verification_link !== token && user.verification_code !== code) {
            throw new unauthenticated_1.UnauthenticatedError("Verification Failed");
        }
        await (0, UsersModel_2.verifyTheUser)(validEmail, true, new Date(), "", -1);
        res.status(200).json({ msg: "User Verified", status: true });
    }
    catch (error) {
        if (error instanceof Error) {
            // Handle known error types
            res.status(400).json({ msg: error.message, status: false });
        }
        else {
            // Handle unknown error types
            res.status(500).json({ msg: "An unknown error occurred", status: false });
        }
    }
};
exports.verifyEmail = verifyEmail;
