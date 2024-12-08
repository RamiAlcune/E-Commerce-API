"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCurrentPassword = exports.UpdateUserByID = exports.getSingleUserByID = exports.getUsers = exports.createUser = exports.getUserByUserName = void 0;
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
    const [result] = (await database_1.default.query("INSERT INTO users (username,password,email,verifcationToken) VALUES (?,?,?,?)", [
        user.username,
        user.password,
        user.email,
        user.verifcationToken,
    ]));
    const [rows] = (await database_1.default.query("SELECT * FROM users WHERE id = ?", [result.insertId]));
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
