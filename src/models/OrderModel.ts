import { RowDataPacket } from "mysql2";
import connection from "../database";
import { ResultSetHeader } from "mysql2";
export enum OrderStatus {
  Pending = "Pending",
  Processing = "Processing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}
export interface OrderI extends RowDataPacket {
  id_order?: number;
  tax: number;
  shippingFee: number;
  subTotal: number;
  status: OrderStatus;
  clientSecret: string;
  paymentId: number;
  id_user: number;
}
//getAllOrders, getSingleOrder, getCurrentUserOrders,  createOrder, updateOrder) functions

export const GetAllOrders = async () => {
  try {
    const [result] = await connection.query("SELECT orders.*,product_id,amount from orders INNER JOIN order_items USING(id_order)");
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    return;
  }
};

export const GetSingleOrder = async (id_order: number): Promise<OrderI | void> => {
  try {
    const [result] = await connection.query<OrderI[]>("SELECT * FROM orders  WHERE id_order = ?", [id_order]);
    return result[0];
  } catch (error) {
    console.error("Error executing query:", error);
    return;
  }
};

export const GetCurrentUserOrders = async (id_user: number) => {
  try {
    const [result] = await connection.query<OrderI[]>("SELECT * FROM orders  WHERE id_user = ?", [id_user]);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    return;
  }
};

export const CreateOrder = async (order: OrderI) => {
  try {
    const values = Object.values(order);
    const columns = Object.keys(order).join(",");
    const QuestionMark = Object.keys(order)
      .map(() => "?")
      .join(",");

    const [result] = (await connection.query(`INSERT INTO orders (${columns}) VALUES (${QuestionMark})`, values)) as ResultSetHeader[];

    return { id_review: result.insertId, ...order };
  } catch (error) {
    console.error("Error executing query:", error);
    return;
  }
};
