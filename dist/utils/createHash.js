"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashString = void 0;
const crypto_1 = __importDefault(require("crypto"));
const hashString = (text) => crypto_1.default.createHash("md5").update(text).digest("hex");
exports.hashString = hashString;
