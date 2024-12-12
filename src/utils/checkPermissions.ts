import { request } from "http";
import { ReqUserI } from "../models/UsersModel";
import { UnauthentizedError } from "../errors/unauthorized";

export const checkPermissions = (requestUser: ReqUserI, resourseUserId: number) => {
  console.log(requestUser);
  if (requestUser.id !== resourseUserId && requestUser.role !== "admin") {
    throw new UnauthentizedError("Access denied!");
  }
};
