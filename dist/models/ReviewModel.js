"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReviewdByUser = exports.UpdateReview = exports.DeleteReview = exports.GetSingleReview = exports.GetReviews = exports.CreateReview = void 0;
const database_1 = __importDefault(require("../database"));
const CreateReview = async (Review) => {
    try {
        const values = Object.values(Review);
        const columns = Object.keys(Review).join(",");
        const QuestionMark = Object.keys(Review)
            .map(() => "?")
            .join(",");
        const [result] = (await database_1.default.query(`INSERT INTO review (${columns}) VALUES (${QuestionMark})`, values));
        return { id_review: result.insertId, ...Review };
    }
    catch (error) {
        console.error("Error executing query:", error);
        return;
    }
};
exports.CreateReview = CreateReview;
const GetReviews = async () => {
    try {
        const [result] = await database_1.default.query("SELECT review.*,name,price,company from review INNER JOIN products USING(id_product)");
        return result;
    }
    catch (error) {
        console.error("Error executing query:", error);
        return;
    }
};
exports.GetReviews = GetReviews;
const GetSingleReview = async (id_review) => {
    try {
        const [result] = await database_1.default.query("SELECT review.*,name,price,company from review INNER JOIN products USING(id_product) WHERE id_review = ?", [id_review]);
        return result[0];
    }
    catch (error) {
        console.error("Error executing query:", error);
        return;
    }
};
exports.GetSingleReview = GetSingleReview;
const DeleteReview = async (id_review) => {
    try {
        const [result] = await database_1.default.query("DELETE FROM review WHERE id_review = ?", [id_review]);
        return result;
    }
    catch (error) {
        console.error("Error executing query:", error);
        return;
    }
};
exports.DeleteReview = DeleteReview;
const UpdateReview = async (data, id_review) => {
    try {
        const [result] = await database_1.default.query("UPDATE review SET ? WHERE id_review = ?; SELECT * FROM review WHERE id_review = ?", [
            data,
            id_review,
            id_review,
        ]);
        return result[1];
    }
    catch (error) {
        console.error("Error executing query:", error);
        return;
    }
};
exports.UpdateReview = UpdateReview;
const isReviewdByUser = async (productId, userId) => {
    try {
        const [rows] = await database_1.default.query("SELECT COUNT(*) AS count FROM review WHERE id_user = ? AND id_product = ?", [userId, productId]);
        const count = rows[0]?.count;
        return count > 0;
    }
    catch (error) {
        console.error("Error executing query:", error);
        return false;
    }
};
exports.isReviewdByUser = isReviewdByUser;
