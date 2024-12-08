"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrder = exports.GetCurrentUserOrders = exports.GetSingleOrder = exports.GetAllOrders = exports.OrderStatus = void 0;
const database_1 = __importDefault(require("../database"));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "Pending";
    OrderStatus["Processing"] = "Processing";
    OrderStatus["Shipped"] = "Shipped";
    OrderStatus["Delivered"] = "Delivered";
    OrderStatus["Cancelled"] = "Cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
//getAllOrders, getSingleOrder, getCurrentUserOrders,  createOrder, updateOrder) functions
const GetAllOrders = async () => {
    try {
        const [result] = await database_1.default.query("SELECT orders.*,product_id,amount from orders INNER JOIN order_items USING(id_order)");
        return result;
    }
    catch (error) {
        console.error("Error executing query:", error);
        return;
    }
};
exports.GetAllOrders = GetAllOrders;
const GetSingleOrder = async (id_order) => {
    try {
        const [result] = await database_1.default.query("SELECT * FROM orders  WHERE id_order = ?", [id_order]);
        return result[0];
    }
    catch (error) {
        console.error("Error executing query:", error);
        return;
    }
};
exports.GetSingleOrder = GetSingleOrder;
const GetCurrentUserOrders = async (id_user) => {
    try {
        const [result] = await database_1.default.query("SELECT * FROM orders  WHERE id_user = ?", [id_user]);
        return result;
    }
    catch (error) {
        console.error("Error executing query:", error);
        return;
    }
};
exports.GetCurrentUserOrders = GetCurrentUserOrders;
const CreateOrder = async (order) => {
    try {
        const values = Object.values(order);
        const columns = Object.keys(order).join(",");
        const QuestionMark = Object.keys(order)
            .map(() => "?")
            .join(",");
        const [result] = (await database_1.default.query(`INSERT INTO orders (${columns}) VALUES (${QuestionMark})`, values));
        return { id_review: result.insertId, ...order };
    }
    catch (error) {
        console.error("Error executing query:", error);
        return;
    }
};
exports.CreateOrder = CreateOrder;
