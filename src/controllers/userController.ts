import { StatusCodes } from "http-status-codes";
import { getUsers, getSingleUserByID, UpdateUserByID, changeCurrentPassword } from "../models/UsersModel";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { error } from "console";
import { BadRequestError } from "../errors/bad-request";
import { createTokenUser } from "../utils/createTokenUser";
import { attachCookiesResponse } from "../utils/jwt";
import { UnauthenticatedError } from "../errors/unauthenticated";
import { checkPermissions } from "../utils/checkPermissions";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await getUsers();
  if (!users) res.status(404).json({ msg: "no users are available", status: false });
  res.status(200).json({ data: users, status: true });
};

export const getUserByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getSingleUserByID(parseInt(id, 10));
  if (!user || !id) res.status(404).json({ msg: "User is not found", status: false });
  checkPermissions(req.user!, user!.id);
  res.status(200).json({ data: user, status: true });
};

export const showCurrentUser = async (req: Request, res: Response) => {
  console.log(req.user);
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { email, username } = req.body;
  if (!email || !username) {
    throw new BadRequestError("email and user  details are required.");
  }

  if (!req.user) {
    throw new UnauthenticatedError("Login Before Sending This Request!");
  }
  const updated = await UpdateUserByID(req.user?.id, { username: req.body.username, email: req.body.email });
  console.log(updated);
  if (!updated?.affectedRows) {
    res.status(400).json({ msg: "Error 400, User is not updated", status: false });
    return;
  }
  const userUpdated = await getSingleUserByID(req.user?.id ?? -1);
  if (userUpdated === null) {
    res.status(404).json({ msg: "The User You Trying to get is not exist.", status: false });
    return;
  }
  const TokenUser = createTokenUser(userUpdated);
  await attachCookiesResponse({ res, user: TokenUser });
  res.status(201).json({ msg: "User information has been successfully updated.", data: TokenUser, status: true });
};

export const updateUserPassword = async (req: Request, res: Response) => {
  const id = req.user?.id;
  const { oldPassword, newPassword } = req.body;
  if (!id) {
    res.status(402).json({ msg: "Please Login Before Sending a Request For Changing the Password!", status: false });
    return;
  }

  if (!oldPassword || !newPassword) {
    res.status(402).json({ msg: "Please Provide The Old Password and The New Password at the body.", status: false });
  }
  const user = await getSingleUserByID(id);
  if (!user) {
    return;
  }
  const isValid = await bcrypt.compare(oldPassword, user.password);
  if (!isValid) {
    res.status(402).json({ msg: "The Old Password is not match the current user Password.", status: false });
    return;
  }
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await changeCurrentPassword(id, newPasswordHash);
  res.status(201).json({ msg: "Password has Been Changed!", status: true });
};
