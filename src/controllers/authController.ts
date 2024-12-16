import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction, response } from "express";
import { getUserByUserName, createUser, UserInput, getSingleUserByID, AddForgetPasswordToken } from "../models/UsersModel";
import { attachCookiesResponse } from "../utils/jwt";
import { createTokenUser } from "../utils/createTokenUser";
import { getSingleUserByEmail, verifyTheUser } from "../models/UsersModel";
import crypto, { createHash } from "crypto";
import { UnauthenticatedError } from "../errors/unauthenticated";
import { sendVerifactionEmail, DetailsForVerifactionCode, sendResetPasswordEmail } from "../utils/sendVerficationEmail";
import { createToken, TokenI, getTokenByUserID, deleteToken } from "../models/tokenModel";
import { BadRequestError } from "../errors/bad-request";
import { hashString } from "../utils/createHash";
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.status(200).json({ msg: "All fields are required.", status: false });
    return;
  }
  const userExist = await getUserByUserName(username);
  if (userExist) {
    res.status(200).json({ msg: "This account has already been registered.", status: false });
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
  res.status(200).json({ msg: "Success! Please Check Your Email to verify the account.", status: true });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { password, userOrEmail } = req.body;
  if (!userOrEmail || !password) {
    res.status(200).json({ msg: "All fields are required.", status: false });
    return;
  }

  const userExist = await getUserByUserName(userOrEmail);
  if (!userExist) {
    res.status(200).json({ msg: "This account is not registered.", status: false });
    return;
  }
  if (userExist.username !== userOrEmail && userExist.email !== userOrEmail) {
    res.status(200).json({ msg: "username or email are not valid!", status: false });
  }
  const isPasswordValid = await bcrypt.compare(password, userExist.password);

  if (!isPasswordValid) {
    res.status(200).json({ msg: "The password you entered is incorrect. Please verify and try again.", status: false });
  }
  if (!userExist.isVerified) {
    res.status(200).json({ msg: "Please Verify The account before trying to login.", status: false });
    return;
  }
  const UserReq = createTokenUser(userExist);
  //create refresh Token
  let refresh_token = "";

  const existingToken = await getTokenByUserID(userExist.id);
  console.log(JSON.stringify(existingToken));
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    refresh_token = existingToken.refresh_token;
    await attachCookiesResponse({ res, user: UserReq, refresh_token });
    res.status(200).json({ msg: "You have successfully logged in.", status: true });
    return;
  }
  //check for existing Token
  refresh_token = crypto.randomBytes(40).toString("hex");
  const user_agent = req.headers["user-agent"] as string;
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() || (req.socket.remoteAddress as string);

  const userToken: TokenI = { refresh_token, ip, user_agent, id_user: userExist.id };
  const token = await createToken(userToken);
  await attachCookiesResponse({ res, user: UserReq, refresh_token });
  res.status(200).json({ token: token });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  // Invalidate the cookies
  res.cookie("accsesToken", "logout", { httpOnly: true, expires: new Date(Date.now()) });
  res.cookie("refreshToken", "logout", { httpOnly: true, expires: new Date(Date.now()) });

  // Perform logout actions
  await deleteToken(req.user.id);
  // Send a successful logout response
  res.status(200).json({ msg: "User logged out!", status: true });
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
      res.status(200).json({ msg: error.message, status: false });
    } else {
      // Handle unknown error types
      res.status(200).json({ msg: "An unknown error occurred", status: false });
    }
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please Provide Valid Email");
  }

  const user = await getSingleUserByEmail(email);
  if (user) {
    const password_token = crypto.randomBytes(70).toString("hex");
    const password_token_code = Math.floor(10000000 + Math.random() * 90000000);
    // Send Email
    const password_token_expiration = new Date(Date.now() + 1000 * 60 * 10);
    const hashedToken = hashString(password_token);
    await AddForgetPasswordToken({ password_token: hashedToken, password_token_expiration, password_token_code }, email);

    const Data: DetailsForVerifactionCode = {
      name: user.username!,
      email: user.email!,
      password_token: password_token,
      password_token_code: password_token_code,
      password_token_expiration: password_token_expiration,
      origin: "http://localhost:5000",
    };
    await sendResetPasswordEmail(Data);
  }
  res.status(200).json({ msg: "Please check your email" });
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    const { code, password } = req.body;
    let validEmail = (req.query.email as string) || req.body.email;
    const user = await getSingleUserByEmail(validEmail);
    if (!user) {
      throw new UnauthenticatedError("User is not exist..");
    }
    console.log("code", user.password_token_code, code);
    if (user.password_token !== token && user.password_token_code !== code) {
      throw new UnauthenticatedError("Verification Failed");
    }
    if (token) {
      const currentDate = new Date(Date.now());
      const hashedToken = hashString(token as string);
      if (user.password_token === hashedToken && user.password_token_expiration! > currentDate) {
        const HashedPassword = await bcrypt.hash(password, 10);
        await AddForgetPasswordToken({ password: HashedPassword, password_token: null, password_token_expiration: null, password_token_code: null }, validEmail);
      }
    } else {
      if (code) {
        const currentDate = new Date(Date.now());
        if (user.password_token_code === code && user.password_token_expiration! > currentDate) {
          const HashedPassword = await bcrypt.hash(password, 10);
          await AddForgetPasswordToken({ password: HashedPassword, password_token: null, password_token_expiration: null, password_token_code: null }, validEmail);
        }
      }
    }

    res.status(200).json({ msg: "Password has been Changed!", status: true });
  } catch (error) {
    if (error instanceof Error) {
      // Handle known error types
      res.status(200).json({ msg: error.message, status: false });
    } else {
      // Handle unknown error types
      res.status(200).json({ msg: "An unknown error occurred", status: false });
    }
  }
};

export const cookieStatus = async (req: Request, res: Response) => {
  if (!req.signedCookies.accsesToken || !req.signedCookies.refreshToken) {
    res.status(200).json({ msg: "The Cookies are not available", status: false });
    return;
  } else {
    res.status(200).json({ msg: "Cookies are available", status: true });
  }
};
