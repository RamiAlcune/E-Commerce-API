import { UserReqI } from "../models/UsersModel";

export const createTokenUser = (user: UserReqI) => {
  return { username: user.username, id: user.id, role: user.role };
};
