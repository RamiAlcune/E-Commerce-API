"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = exports.updateUser = exports.showCurrentUser = exports.getUserByEmail = exports.getUserByID = exports.getAllUsers = void 0;
const http_status_codes_1 = require("http-status-codes");
const UsersModel_1 = require("../models/UsersModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const bad_request_1 = require("../errors/bad-request");
const createTokenUser_1 = require("../utils/createTokenUser");
const jwt_1 = require("../utils/jwt");
const unauthenticated_1 = require("../errors/unauthenticated");
const checkPermissions_1 = require("../utils/checkPermissions");
const getAllUsers = async (req, res) => {
    const users = await (0, UsersModel_1.getUsers)();
    if (!users)
        res.status(404).json({ msg: "no users are available", status: false });
    res.status(200).json({ data: users, status: true });
};
exports.getAllUsers = getAllUsers;
const getUserByID = async (req, res) => {
    const { id } = req.params;
    const user = await (0, UsersModel_1.getSingleUserByID)(parseInt(id, 10));
    if (!user || !id)
        res.status(404).json({ msg: "User is not found", status: false });
    (0, checkPermissions_1.checkPermissions)(req.user, user.id);
    res.status(200).json({ data: user, status: true });
};
exports.getUserByID = getUserByID;
const getUserByEmail = async (req, res) => {
    const { email } = req.params;
    const user = await (0, UsersModel_1.getSingleUserByEmail)(email);
    if (!user || !email)
        res.status(404).json({ msg: "User is not found", status: false });
    (0, checkPermissions_1.checkPermissions)(req.user, user.id);
    res.status(200).json({ data: user, status: true });
};
exports.getUserByEmail = getUserByEmail;
const showCurrentUser = async (req, res) => {
    console.log(req.user);
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: req.user });
};
exports.showCurrentUser = showCurrentUser;
const updateUser = async (req, res) => {
    const { email, username } = req.body;
    if (!email || !username) {
        throw new bad_request_1.BadRequestError("email and user  details are required.");
    }
    if (!req.user) {
        throw new unauthenticated_1.UnauthenticatedError("Login Before Sending This Request!");
    }
    const updated = await (0, UsersModel_1.UpdateUserByID)(req.user?.id, { username: req.body.username, email: req.body.email });
    console.log(updated);
    if (!updated?.affectedRows) {
        res.status(400).json({ msg: "Error 400, User is not updated", status: false });
        return;
    }
    const userUpdated = await (0, UsersModel_1.getSingleUserByID)(req.user?.id ?? -1);
    if (userUpdated === null) {
        res.status(404).json({ msg: "The User You Trying to get is not exist.", status: false });
        return;
    }
    const TokenUser = (0, createTokenUser_1.createTokenUser)(userUpdated);
    await (0, jwt_1.attachCookiesResponse)({ res, user: TokenUser });
    res.status(201).json({ msg: "User information has been successfully updated.", data: TokenUser, status: true });
};
exports.updateUser = updateUser;
const updateUserPassword = async (req, res) => {
    const id = req.user?.id;
    const { oldPassword, newPassword } = req.body;
    if (!id) {
        res.status(402).json({ msg: "Please Login Before Sending a Request For Changing the Password!", status: false });
        return;
    }
    if (!oldPassword || !newPassword) {
        res.status(402).json({ msg: "Please Provide The Old Password and The New Password at the body.", status: false });
    }
    const user = await (0, UsersModel_1.getSingleUserByID)(id);
    if (!user) {
        return;
    }
    const isValid = await bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isValid) {
        res.status(402).json({ msg: "The Old Password is not match the current user Password.", status: false });
        return;
    }
    const newPasswordHash = await bcryptjs_1.default.hash(newPassword, 10);
    await (0, UsersModel_1.changeCurrentPassword)(id, newPasswordHash);
    res.status(201).json({ msg: "Password has Been Changed!", status: true });
};
exports.updateUserPassword = updateUserPassword;
