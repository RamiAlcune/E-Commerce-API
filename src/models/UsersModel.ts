import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import connection from "../database";
import validator from "validator";
//Database Row Interface!

export interface UserI extends RowDataPacket {
  username: string;
  email: string;
  password: string;
  id: number;
  role: string;
}

export interface ReqUserI {
  id: number;
  username?: string;
  role?: string;
}

export interface UserReqI {
  username?: string;
  email?: string;
  password: string;
  id: number;
  role?: string;
}

export interface UserFindAndUpdate {
  username: string;
  email: string;
}

interface UserCountRow extends RowDataPacket {
  count: number;
}

//User Input Interface.
export interface UserInput {
  username: string;
  email: string;
  password: string;
}
export const getUserByUserName = async (username: string): Promise<UserI | null> => {
  const [rows] = await connection.query<UserI[]>("SELECT * FROM users WHERE username = ?", [username]);
  return rows[0] || null;
};

export const createUser = async (user: UserInput): Promise<UserReqI> => {
  if (!validator.isEmail(user.email)) {
    throw new Error("Invalid email format");
  }
  const [result] = (await connection.query("INSERT INTO users (username,password,email) VALUES (?,?,?)", [
    user.username,
    user.password,
    user.email,
  ])) as ResultSetHeader[];
  return { id: result.insertId, ...user };
};

export const getUsers = async () => {
  const [result] = await connection.query("SELECT id,username,email,role from users WHERE role = 'user' ");
  return result;
};

export const getSingleUserByID = async (id: number): Promise<UserReqI | null> => {
  const [result] = await connection.query<UserI[]>("SELECT * from users WHERE  id = ?", [id]);
  return result[0] || null;
};

export const UpdateUserByID = async (id: any, UpdatedData: Partial<UserFindAndUpdate>): Promise<ResultSetHeader | null> => {
  const [result] = await connection.query<ResultSetHeader>(`UPDATE users SET ? WHERE id = ?`, [UpdatedData, id]);
  if (!result) return null;
  return result;
};

export const changeCurrentPassword = async (id: any, newPassword: string): Promise<ResultSetHeader | null> => {
  try {
    const [updateRow] = await connection.query<ResultSetHeader>("UPDATE users SET password = ? WHERE id = ?", [newPassword, id]);
    return updateRow;
  } catch (error) {
    console.error("Error changing password:", error);
    return null;
  }
};
