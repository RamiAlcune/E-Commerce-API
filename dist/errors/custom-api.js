"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAPIError = void 0;
class CustomAPIError extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.name = this.constructor.name; // Set the error name to the class name
        this.statusCode = 500;
    }
}
exports.CustomAPIError = CustomAPIError;
