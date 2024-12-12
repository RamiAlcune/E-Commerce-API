//{ refreshToken, ip, userAgent, id_user: userExist.id }
import { ResultSetHeader } from "mysql2";
import connection from "../database";
export interface TokenI {
  refresh_token: string;
  ip: string;
  user_agent: string;
  id_user: number;
  isValid?: boolean;
}

export const createToken = async (token: TokenI) => {
  const values = Object.values(token);
  const col = Object.keys(token).join(",");
  const places = Object.keys(token)
    .map(() => "?")
    .join(",");
  const [result] = (await connection.query(`INSERT INTO token (${col}) VALUES (${places})`, values)) as ResultSetHeader[];
  return result.affectedRows;
};
