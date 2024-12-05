import { NextFunction, Request, Response } from "express";
import { isTokenValid } from "../utils/jwt";
import { UnauthenticatedError } from "../errors/unauthenticated";
import { ReqUserI } from "../models/UsersModel";
import { UnauthentizedError } from "../errors/unauthorized";
export interface CustomRequestForUserReq extends Request {
  user: ReqUserI; // For single user
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.signedCookies.token;
  console.log(token);
  if (!token) throw new UnauthenticatedError("Authentication Error");
  try {
    const decoded = isTokenValid(token);
    if (!decoded) {
      res.status(401).json({ msg: "Authentication Error: Invalid token" });
      return;
    }
    const { username, id, role } = decoded;
    console.log(`authenticateUser: ${id}`);
    req.user = { username, id, role };
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
