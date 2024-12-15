import { NextFunction, Request, Response } from "express";
import { isTokenValid } from "../utils/jwt";
import { UnauthenticatedError } from "../errors/unauthenticated";
import { ReqUserI } from "../models/UsersModel";
import { UnauthentizedError } from "../errors/unauthorized";
import { getTokenByUserID } from "../models/tokenModel";
import { attachCookiesResponse } from "../utils/jwt";
export interface CustomRequestForUserReq extends Request {
  user: ReqUserI; // For single user
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { refreshToken, accsesToken } = req.signedCookies;
  try {
    if (accsesToken) {
      const payload = isTokenValid(accsesToken);
      console.log(`payload: ${payload}`);
      req.user = payload;
      console.log(req.user);
      return next();
    }
    //Refresh Token
    const payload = isTokenValid(refreshToken);
    const existingToken = await getTokenByUserID(payload.id, refreshToken);
    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError("Authentication Invalid");
    }
    attachCookiesResponse({ res, user: payload.id, refresh_token: existingToken.refresh_token });
    req.user = payload;
    console.log(req.user);
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

export const authorizePermissions = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role as string)) {
      throw new UnauthentizedError("Unauthorized to accses this route");
    }
    next();
  };
  // if (req.user?.role !== "admin") {
  //   throw new UnauthentizedError("Unauthorized to accses this route");
  // }
  // console.log("Admin Route!");
  // next();
};
