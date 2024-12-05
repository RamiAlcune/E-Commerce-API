"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accses = {
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_NAME,
    password: process.env.MYSQL_PASSWORD,
    port: Number(process.env.MYSQL_PORT),
};
const connection = promise_1.default.createPool(accses);
exports.default = connection;
