"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorazition_1 = require("../middlewares/authorazition");
const userController_1 = require("../controllers/userController");
const UsersRoute = express_1.default.Router();
// Route for getting all users
UsersRoute.get("/", authorazition_1.authenticateUser, (0, authorazition_1.authorizePermissions)("user", "admin"), userController_1.getAllUsers);
UsersRoute.patch("/UpdateUser", authorazition_1.authenticateUser, (0, authorazition_1.authorizePermissions)("user", "admin"), userController_1.updateUser);
// Route for showing the current user
UsersRoute.get("/showMe", authorazition_1.authenticateUser, userController_1.showCurrentUser);
// Route for changing user password
UsersRoute.post("/changePassword", authorazition_1.authenticateUser, (0, authorazition_1.authorizePermissions)("user", "admin"), userController_1.updateUserPassword);
// Route for getting a user by ID
UsersRoute.get("/:id", authorazition_1.authenticateUser, (0, authorazition_1.authorizePermissions)("user", "admin"), userController_1.getUserByID);
// Route for updating user details (uncomment if needed in the future)
// UsersRoute.patch(
//   "/updateUser",
//   authenticateUser as RequestHandler,
//   authorizePermissions("user", "admin"),
//   updateUser
// );
exports.default = UsersRoute;
