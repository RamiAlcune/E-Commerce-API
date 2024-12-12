import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction, response } from "express";
import { getUserByUserName, createUser, UserInput, getSingleUserByID } from "../models/UsersModel";
import { attachCookiesResponse } from "../utils/jwt";
import { createTokenUser } from "../utils/createTokenUser";
import { getSingleUserByEmail, verifyTheUser } from "../models/UsersModel";
import crypto from "crypto";
import { UnauthenticatedError } from "../errors/unauthenticated";
import { sendVerifactionEmail, DetailsForVerifactionCode } from "../utils/sendVerficationEmail";
import { createToken, TokenI } from "../models/tokenModel";
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

  const verifcationToken = crypto.randomBytes(40).toString("hex");
  const verificationCode = Math.floor(10000000 + Math.random() * 90000000);
  console.log(verificationCode);
  const userCreated = await createUser({ username, email, password: hashedPassowrd, verifcationToken, verificationCode });
  const Data: DetailsForVerifactionCode = {
    name: userCreated?.username!,
    email: userCreated?.email!,
    verifcationToken: userCreated?.verification_link!,
    verificationCode: userCreated?.verification_code!,
    origin: "http://localhost:5000",
  };
  await sendVerifactionEmail(Data);
  //send verif
  res.status(201).json({ msg: "Success! Please Check Your Email to verify the account.", status: true });
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
  const UserReq = createTokenUser(userExist);
  //create refresh Token
  let refresh_token = "";

  //check for existing Token
  refresh_token = crypto.randomBytes(40).toString("hex");
  const user_agent = req.headers["user-agent"] as string;
  const ip = req.ip as string;
  const userToken: TokenI = { refresh_token, ip, user_agent, id_user: userExist.id };
  const token = await createToken(userToken);
  // await attachCookiesResponse({ res, user: UserReq });
  res.status(201).json({ userToken: userToken, token: token });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.cookie("token", "logout", { httpOnly: true, expires: new Date(Date.now()) });
  res.status(200).json({ status: true });
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    const { code } = req.body;
    let validEmail = (req.query.email as string) || req.body.email;

    const user = await getSingleUserByEmail(validEmail);
    if (!user) {
      throw new UnauthenticatedError("Verification Failed, user not found");
    }

    console.log(`user ver link: ${user.verification_link}, req.query token: ${token}`);
    console.log(`user code: ${user.verification_code}, req.body code : ${code}`);
    if (user.verification_link !== token && user.verification_code !== code) {
      throw new UnauthenticatedError("Verification Failed");
    }

    await verifyTheUser(validEmail, true, new Date(), "", -1);

    res.status(200).json({ msg: "User Verified", status: true });
  } catch (error) {
    if (error instanceof Error) {
      // Handle known error types
      res.status(400).json({ msg: error.message, status: false });
    } else {
      // Handle unknown error types
      res.status(500).json({ msg: "An unknown error occurred", status: false });
    }
  }
};
