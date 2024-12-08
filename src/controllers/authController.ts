import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction, response } from "express";
import { getUserByUserName, createUser, UserInput } from "../models/UsersModel";
import { attachCookiesResponse } from "../utils/jwt";
import { createTokenUser } from "../utils/createTokenUser";
import { token } from "morgan";
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

  const verifcationToken = "fake token";

  const userCreated = await createUser({ username, email, password: hashedPassowrd, verifcationToken });

  //send verif
  res
    .status(201)
    .json({ msg: "Success! Please Check Your Email to verify the account.", verifcationToken: userCreated?.verifcationToken, status: true });
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
    res.status(StatusCodes.NOT_FOUND).json({ msg: "The password you entered is incorrect. Please verify and try again.", status: false });
  }
  if (!userExist.isVerified) {
    res.status(401).json({ msg: "Please Verify The account before trying to login.", status: false });
    return;
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
