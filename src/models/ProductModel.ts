import { ResultSetHeader, RowDataPacket } from "mysql2";
import connection from "../database";

export interface ProductsI extends RowDataPacket {
  id_product?: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: string;
  company: string;
  colors: string;
  featured?: boolean;
  freeShipping?: boolean;
  inventory?: number;
  averageRating?: number;
  user_id: number;
}
export const GetProducts = async () => {
  const [result] = await connection.query("SELECT * FROM products");
  return result;
};

export const GetSingleProduct = async (id_product: number): Promise<ProductsI | null> => {
  const [result] = await connection.query<ProductsI[]>("SELECT * FROM products WHERE id_product = ?", [id_product]);
  return result[0] || null;
};

export const createProducts = async (DataCreated: ProductsI): Promise<ProductsI> => {
  if (Array.isArray(DataCreated.colors)) {
    DataCreated.colors = JSON.stringify(DataCreated.colors);
  }
  const values = Object.values(DataCreated);
  const col = Object.keys(DataCreated).join(",");
  const places = Object.keys(DataCreated)
    .map(() => "?")
    .join(",");

  const [result] = (await connection.query(`INSERT INTO products (${col}) VALUES (${places})`, values)) as ResultSetHeader[];
  return { id_product: result.insertId, ...DataCreated };
};

export const deleteProducts = async (id_product: number) => {
  const [result] = await connection.query("DELETE FROM products WHERE id_product = ?", [id_product]);
  if (!result) return 0;
  return 1;
};

export const updateProducts = async (updatedProduct: Partial<ProductsI>, id_product: number) => {
  const [result] = await connection.query("UPDATE products SET ? WHERE id_product = ?", [updatedProduct, id_product]);
  return result;
};

export const GetSingleProductReviews = async (id_product: number) => {
  try {
    const [result] = await connection.query("SELECT * from review WHERE id_product = ?", [id_product]);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    return;
  }
};
