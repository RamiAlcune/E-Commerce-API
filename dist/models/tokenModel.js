"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
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
