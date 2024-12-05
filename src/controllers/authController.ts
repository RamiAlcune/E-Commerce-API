import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction, response } from "express";
import { getUserByUserName, createUser, UserInput } from "../models/UsersModel";
import { attachCookiesResponse } from "../utils/jwt";
import { createTokenUser } from "../utils/createTokenUser";
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "All fields are required.", status: false });
    return;
  }
  const userExist = await getUserByUserName(username);
  if (userExist) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "This account has already been registered.", status: false });
    return;
  }

  const hashedPassowrd = await bcrypt.hash(password, 10);

  const userCreated = await createUser({ username, email, password: hashedPassowrd });

  if (!userCreated.role) userCreated.role = "user";
  const TokenUser = createTokenUser(userCreated);
  // const token = await generateToken({ userId: userCreated.id, user: userCreated.user });
  await attachCookiesResponse({ res, user: userCreated.username });
  res.status(200).json({ msg: "Registration Successful!", data: TokenUser, status: true });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const userInfo = req.body;
  if (!userInfo.username || !userInfo.password || !userInfo.email) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "All fields are required.", status: false });
    return;
  }

  const userExist = await getUserByUserName(userInfo.username);
  if (!userExist) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "This account is not registered.", status: false });
    return;
  }

  const isPasswordValid = await bcrypt.compare(userInfo.password, userExist.password);

  if (!isPasswordValid) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "The password you entered is incorrect. Please verify and try again.", status: false });
  }
  // const token = await generateToken(userInfo.user);
  const UserReq = createTokenUser(userExist);
  await attachCookiesResponse({ res, user: UserReq });
  res.status(201).json({ msg: "You have successfully logged in", status: true });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.cookie("token", "logout", { httpOnly: true, expires: new Date(Date.now()) });
  res.status(200).json({ status: true });
};
