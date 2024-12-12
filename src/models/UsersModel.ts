import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import connection from "../database";
import validator from "validator";
import { boolean } from "joi";
//Database Row Interface!

export interface UserI extends RowDataPacket {
  username: string;
  email: string;
  password: string;
  id: number;
  role: string;
  isVerified?: boolean;
  verifcationToken: string;
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
  verification_code?: number;
  verification_link?: string;
  isVerified?: boolean;
  verified?: Date;
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
  verifcationToken: string;
  verificationCode: number;
}
export const getUserByUserName = async (username: string): Promise<UserI | null> => {
  const [rows] = await connection.query<UserI[]>("SELECT * FROM users WHERE username = ?", [username]);
  return rows[0] || null;
};

export const createUser = async (user: UserInput): Promise<UserReqI | null> => {
  if (!validator.isEmail(user.email)) {
    throw new Error("Invalid email format");
  }

  // Insert user into the `users` table
  const [result] = (await connection.query("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [
    user.username,
    user.password,
    user.email,
  ])) as ResultSetHeader[];

  // Check if the user insert was successful and get the inserted ID
  if (!result.insertId) {
    throw new Error("Failed to create user");
  }
  const userId = result.insertId;

  // Insert verification details into the `auth_codes` table
  await connection.query("INSERT INTO auth_codes (id_user, verification_code, verification_link) VALUES (?, ?, ?)", [
    userId,
    user.verificationCode,
    user.verifcationToken,
  ]);

  // Fetch the user details to return
  const [rows] = (await connection.query(
    "SELECT users.*, verification_code, verification_link FROM users INNER JOIN auth_codes ON users.id = auth_codes.id_user WHERE id = ?",
    [userId]
  )) as RowDataPacket[];
  if (rows.length > 0) {
    return rows[0] as UserReqI;
  }

  return null;
};

export const getUsers = async () => {
  const [result] = await connection.query("SELECT id,username,email,role from users WHERE role = 'user' ");
  return result;
};

export const getSingleUserByID = async (id: number): Promise<UserReqI | null> => {
  const [result] = await connection.query<UserI[]>("SELECT * from users WHERE  id = ?", [id]);
  return result[0] || null;
};

export const getSingleUserByEmail = async (email: string): Promise<UserReqI | null> => {
  const [result] = await connection.query<UserI[]>(
    "SELECT users.*, verification_code, verification_link FROM users INNER JOIN auth_codes ON users.id = auth_codes.id_user WHERE email = ?",
    [email]
  );
  return result[0] || null;
};

export const verifyTheUser = async (email: string, isVerified: boolean, verified: Date, verifcationLink: string, verifcationCode: number) => {
  const [result] = await connection.query<ResultSetHeader>(`UPDATE users SET isVerified = ?, verified = ? WHERE email = ?`, [isVerified, verified, email]);

  const [rows] = await connection.query<UserI[]>(`SELECT * FROM users WHERE email = ?`, [email]);

  const [result2] = await connection.query<ResultSetHeader>(`UPDATE auth_codes SET verification_link = ?, verification_code = ? WHERE id_user = ?`, [
    verifcationLink,
    verifcationCode,
    rows[0].id,
  ]);

  if (!result && !result2) return null;
  return result;
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
