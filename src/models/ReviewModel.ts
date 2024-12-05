import { ResultSetHeader, RowDataPacket } from "mysql2";
import connection from "../database";
export interface ReviewI extends RowDataPacket {
  id_review?: number;
  rating: number;
  title: string;
  comment: string;
  id_product: number;
  id_user: number;
}

export interface ReviewUpdateI {
  rating?: number;
  title?: string;
  comment?: string;
}
export const CreateReview = async (Review: ReviewI): Promise<ReviewI | void> => {
  try {
    const values = Object.values(Review);
    const columns = Object.keys(Review).join(",");
    const QuestionMark = Object.keys(Review)
      .map(() => "?")
      .join(",");

    const [result] = (await connection.query(`INSERT INTO review (${columns}) VALUES (${QuestionMark})`, values)) as ResultSetHeader[];
    return { id_review: result.insertId, ...Review };
  } catch (error) {
    console.error("Error executing query:", error);
    return;
  }
};

export const GetReviews = async () => {
  try {
    const [result] = await connection.query("SELECT review.*,name,price,company from review INNER JOIN products USING(id_product)");
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    return;
  }
};

export const GetSingleReview = async (id_review: number): Promise<ReviewI | void> => {
  try {
    const [result] = await connection.query<ReviewI[]>(
      "SELECT review.*,name,price,company from review INNER JOIN products USING(id_product) WHERE id_review = ?",
      [id_review]
    );
    return result[0];
  } catch (error) {
    console.error("Error executing query:", error);
    return;
  }
};

export const DeleteReview = async (id_review: number) => {
  try {
    const [result] = await connection.query("DELETE FROM review WHERE id_review = ?", [id_review]);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    return;
  }
};

export const UpdateReview = async (data: ReviewUpdateI, id_review: number) => {
  try {
    const [result] = await connection.query<ReviewI[]>("UPDATE review SET ? WHERE id_review = ?; SELECT * FROM review WHERE id_review = ?", [
      data,
      id_review,
      id_review,
    ]);
    return result[1];
  } catch (error) {
    console.error("Error executing query:", error);
    return;
  }
};

export const isReviewdByUser = async (productId: number, userId: number): Promise<boolean> => {
  try {
    const [rows] = await connection.query("SELECT COUNT(*) AS count FROM review WHERE id_user = ? AND id_product = ?", [userId, productId]);
    const count = (rows as any)[0]?.count;

    return count > 0;
  } catch (error) {
    console.error("Error executing query:", error);
    return false;
  }
};
