"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteToken = exports.getTokenByUserID = exports.createToken = void 0;
const database_1 = __importDefault(require("../database"));
const createToken = async (token) => {
    const values = Object.values(token);
    const col = Object.keys(token).join(",");
    const places = Object.keys(token)
        .map(() => "?")
        .join(",");
    const [result] = (await database_1.default.query(`INSERT INTO token (${col}) VALUES (${places})`, values));
    return result.affectedRows;
};
exports.createToken = createToken;
const getTokenByUserID = async (id, refreshToken = "") => {
    if (!refreshToken) {
        const [result] = await database_1.default.query("SELECT * FROM token WHERE id_user = ?", [id]);
        if (!result[0]) {
            return null;
        }
        return result[0];
    }
    else {
        const [result] = await database_1.default.query("SELECT * FROM token WHERE id_user = ? AND refresh_token = ?", [id, refreshToken]);
        if (!result[0]) {
            return null;
        }
        return result[0];
    }
};
exports.getTokenByUserID = getTokenByUserID;
const deleteToken = async (id) => {
    const [result] = await database_1.default.query("DELETE FROM token WHERE id_user = ?", [id]);
    return result.affectedRows;
};
exports.deleteToken = deleteToken;
