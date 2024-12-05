import jwt, { Secret } from "jsonwebtoken";
import { Response } from "express";
import dotenv from "dotenv";
import { UserI, UserReqI } from "../models/UsersModel";
dotenv.config();
export const generateToken = async (payload: object) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is missing");
  }
  if (!process.env.JWT_LIFETIME) {
    throw new Error("JWT_LIFETIME environment variable is missing");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};

export const isTokenValid = (token: string): UserReqI => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET) as { payload: UserReqI };
  return decoded.payload;
};

export const attachCookiesResponse = async ({ res, user }: { res: Response; user: any }) => {
  const token = await generateToken({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: true,
    signed: true,
  });
  // res.status(201).json({ msg: "Registration Successful!", status: true });
};
