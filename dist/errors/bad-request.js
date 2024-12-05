"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("./custom-api");
class BadRequestError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}
exports.BadRequestError = BadRequestError;
