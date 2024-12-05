"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthentizedError = void 0;
const http_status_codes_1 = require("http-status-codes");
const custom_api_1 = require("../errors/custom-api");
class UnauthentizedError extends custom_api_1.CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = http_status_codes_1.StatusCodes.FORBIDDEN;
    }
}
exports.UnauthentizedError = UnauthentizedError;