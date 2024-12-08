"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const authorazition_1 = require("../middlewares/authorazition");
const ReviewRoute = express_1.default.Router();
//GET
ReviewRoute.get("/", reviewController_1.getAllReviews);
ReviewRoute.get("/:id", reviewController_1.getSingleReview);
//POST
ReviewRoute.post("/createReview", authorazition_1.authenticateUser, (0, authorazition_1.authorizePermissions)("user"), reviewController_1.createReview);
//PATCH
ReviewRoute.patch("/:id", authorazition_1.authenticateUser, (0, authorazition_1.authorizePermissions)("user"), reviewController_1.updateReview);
//DELETE
ReviewRoute.delete("/:id", authorazition_1.authenticateUser, (0, authorazition_1.authorizePermissions)("user"), reviewController_1.deleteReview);
exports.default = ReviewRoute;
