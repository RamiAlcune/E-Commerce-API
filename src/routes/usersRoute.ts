import express, { RequestHandler } from "express";
import { authenticateUser, authorizePermissions } from "../middlewares/authorazition";
import {
  getAllUsers,
  getUserByID,
  updateUser,
  showCurrentUser,
  updateUserPassword,
} from "../controllers/userController";

const UsersRoute = express.Router();

// Route for getting all users
UsersRoute.get("/", authenticateUser as RequestHandler, authorizePermissions("user", "admin"), getAllUsers);
UsersRoute.patch("/UpdateUser", authenticateUser as RequestHandler, authorizePermissions("user", "admin"), updateUser);
// Route for showing the current user
UsersRoute.get("/showMe", authenticateUser as RequestHandler, showCurrentUser);

// Route for changing user password
UsersRoute.post(
  "/changePassword",
  authenticateUser as RequestHandler,
  authorizePermissions("user", "admin"),
  updateUserPassword
);

// Route for getting a user by ID
UsersRoute.get("/:id", authenticateUser as RequestHandler, authorizePermissions("user", "admin"), getUserByID);

// Route for updating user details (uncomment if needed in the future)
// UsersRoute.patch(
//   "/updateUser",
//   authenticateUser as RequestHandler,
//   authorizePermissions("user", "admin"),
//   updateUser
// );

export default UsersRoute;
