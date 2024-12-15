import jwt, { Secret } from "jsonwebtoken";
import { Response } from "express";
import dotenv from "dotenv";
import { UserI, UserReqI } from "../models/UsersModel";
dotenv.config();
export const generateToken = async (payload: object) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is missing");
  }

  return jwt.sign(payload, process.env.JWT_SECRET);
};

export const isTokenValid = (token: string): UserReqI => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET) as { payload: UserReqI };
  return decoded.payload;
};

export const attachCookiesResponse = async ({ res, user, refresh_token }: { res: Response; user: any; refresh_token: any }) => {
  const accsesTokenJWT = await generateToken({ payload: user });
  const refreshTokenJWT = await generateToken({ payload: { user, refresh_token } });
  const oneDay = 1000 * 60 * 60 * 24;
  const longerDate = 1000 * 60 * 60 * 24 * 24 * 30;

  res.cookie("accsesToken", accsesTokenJWT, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now() + longerDate),
  });
  // res.status(201).json({ msg: "Registration Successful!", status: true });
};

// export const attachSingleCookiesResponse = async ({ res, user }: { res: Response; user: any }) => {
//   const token = await generateToken({ payload: user });
//   const oneDay = 1000 * 60 * 60 * 24;

//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + oneDay),
//     secure: true,
//     signed: true,
//   });
//   // res.status(201).json({ msg: "Registration Successful!", status: true });
// };
