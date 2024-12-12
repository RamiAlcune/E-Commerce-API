"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCurrentPassword = exports.UpdateUserByID = exports.verifyTheUser = exports.getSingleUserByEmail = exports.getSingleUserByID = exports.getUsers = exports.createUser = exports.getUserByUserName = void 0;
const database_1 = __importDefault(require("../database"));
const validator_1 = __importDefault(require("validator"));
const getUserByUserName = async (username) => {
    const [rows] = await database_1.default.query("SELECT * FROM users WHERE username = ?", [username]);
    return rows[0] || null;
};
exports.getUserByUserName = getUserByUserName;
const createUser = async (user) => {
    if (!validator_1.default.isEmail(user.email)) {
        throw new Error("Invalid email format");
    }
    // Insert user into the `users` table
    const [result] = (await database_1.default.query("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [
        user.username,
        user.password,
        user.email,
    ]));
    // Check if the user insert was successful and get the inserted ID
    if (!result.insertId) {
        throw new Error("Failed to create user");
    }
    const userId = result.insertId;
    // Insert verification details into the `auth_codes` table
    await database_1.default.query("INSERT INTO auth_codes (id_user, verification_code, verification_link) VALUES (?, ?, ?)", [
        userId,
        user.verificationCode,
        user.verifcationToken,
    ]);
    // Fetch the user details to return
    const [rows] = (await database_1.default.query("SELECT users.*, verification_code, verification_link FROM users INNER JOIN auth_codes ON users.id = auth_codes.id_user WHERE id = ?", [userId]));
    if (rows.length > 0) {
        return rows[0];
    }
    return null;
};
exports.createUser = createUser;
const getUsers = async () => {
    const [result] = await database_1.default.query("SELECT id,username,email,role from users WHERE role = 'user' ");
    return result;
};
exports.getUsers = getUsers;
const getSingleUserByID = async (id) => {
    const [result] = await database_1.default.query("SELECT * from users WHERE  id = ?", [id]);
    return result[0] || null;
};
exports.getSingleUserByID = getSingleUserByID;
const getSingleUserByEmail = async (email) => {
    const [result] = await database_1.default.query("SELECT users.*, verification_code, verification_link FROM users INNER JOIN auth_codes ON users.id = auth_codes.id_user WHERE email = ?", [email]);
    return result[0] || null;
};
exports.getSingleUserByEmail = getSingleUserByEmail;
const verifyTheUser = async (email, isVerified, verified, verifcationLink, verifcationCode) => {
    const [result] = await database_1.default.query(`UPDATE users SET isVerified = ?, verified = ? WHERE email = ?`, [isVerified, verified, email]);
    const [rows] = await database_1.default.query(`SELECT * FROM users WHERE email = ?`, [email]);
    const [result2] = await database_1.default.query(`UPDATE auth_codes SET verification_link = ?, verification_code = ? WHERE id_user = ?`, [
        verifcationLink,
        verifcationCode,
        rows[0].id,
    ]);
    if (!result && !result2)
        return null;
    return result;
};
exports.verifyTheUser = verifyTheUser;
const UpdateUserByID = async (id, UpdatedData) => {
    const [result] = await database_1.default.query(`UPDATE users SET ? WHERE id = ?`, [UpdatedData, id]);
    if (!result)
        return null;
    return result;
};
exports.UpdateUserByID = UpdateUserByID;
const changeCurrentPassword = async (id, newPassword) => {
    try {
        const [updateRow] = await database_1.default.query("UPDATE users SET password = ? WHERE id = ?", [newPassword, id]);
        return updateRow;
    }
    catch (error) {
        console.error("Error changing password:", error);
        return null;
    }
};
exports.changeCurrentPassword = changeCurrentPassword;
