"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissions = void 0;
const unauthorized_1 = require("../errors/unauthorized");
const checkPermissions = (requestUser, resourseUserId) => {
    console.log(requestUser);
    if (requestUser.id !== resourseUserId && requestUser.role !== "admin") {
        throw new unauthorized_1.UnauthentizedError("Access denied!");
    }
};
exports.checkPermissions = checkPermissions;
