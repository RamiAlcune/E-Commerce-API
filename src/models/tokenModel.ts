//{ refreshToken, ip, userAgent, id_user: userExist.id }
import { ResultSetHeader, RowDataPacket } from "mysql2";
import connection from "../database";
export interface TokenI {
  refresh_token: string;
  ip: string;
  user_agent: string;
  id_user: number;
  isValid?: boolean;
}

export interface TokenOutPutI extends RowDataPacket {
  refresh_token: string;
  ip: string;
  user_agent: string;
  id_user: number;
  isValid: boolean;
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

export const getTokenByUserID = async (id: number, refreshToken: string = "") => {
  if (!refreshToken) {
    const [result] = await connection.query<TokenOutPutI[]>("SELECT * FROM token WHERE id_user = ?", [id]);
    if (!result[0]) {
      return null;
    }
    return result[0];
  } else {
    const [result] = await connection.query<TokenOutPutI[]>("SELECT * FROM token WHERE id_user = ? AND refresh_token = ?", [id, refreshToken]);
    if (!result[0]) {
      return null;
    }
    return result[0];
  }
};

export const deleteToken = async (id: number) => {
  const [result] = await connection.query<ResultSetHeader>("DELETE FROM token WHERE id_user = ?", [id]);
  return result.affectedRows;
};
