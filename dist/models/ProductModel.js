"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSingleProductReviews = exports.updateProducts = exports.deleteProducts = exports.createProducts = exports.GetSingleProduct = exports.GetProducts = void 0;
const database_1 = __importDefault(require("../database"));
const GetProducts = async () => {
    const [result] = await database_1.default.query("SELECT * FROM products");
    return result;
};
exports.GetProducts = GetProducts;
const GetSingleProduct = async (id_product) => {
    const [result] = await database_1.default.query("SELECT * FROM products WHERE id_product = ?", [id_product]);
    return result[0] || null;
};
exports.GetSingleProduct = GetSingleProduct;
const createProducts = async (DataCreated) => {
    if (Array.isArray(DataCreated.colors)) {
        DataCreated.colors = JSON.stringify(DataCreated.colors);
    }
    const values = Object.values(DataCreated);
    const col = Object.keys(DataCreated).join(",");
    const places = Object.keys(DataCreated)
        .map(() => "?")
        .join(",");
    const [result] = (await database_1.default.query(`INSERT INTO products (${col}) VALUES (${places})`, values));
    return { id_product: result.insertId, ...DataCreated };
};
exports.createProducts = createProducts;
const deleteProducts = async (id_product) => {
    const [result] = await database_1.default.query("DELETE FROM products WHERE id_product = ?", [id_product]);
    if (!result)
        return 0;
    return 1;
};
exports.deleteProducts = deleteProducts;
const updateProducts = async (updatedProduct, id_product) => {
    const [result] = await database_1.default.query("UPDATE products SET ? WHERE id_product = ?", [updatedProduct, id_product]);
    return result;
};
exports.updateProducts = updateProducts;
const GetSingleProductReviews = async (id_product) => {
    try {
        const [result] = await database_1.default.query("SELECT * from review WHERE id_product = ?", [id_product]);
        return result;
    }
    catch (error) {
        console.error("Error executing query:", error);
        return;
    }
};
exports.GetSingleProductReviews = GetSingleProductReviews;
