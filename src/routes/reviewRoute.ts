import express from "express";
import { getAllReviews, getSingleReview, deleteReview, updateReview, createReview } from "../controllers/reviewController";
import { authenticateUser, authorizePermissions } from "../middlewares/authorazition";

const ReviewRoute = express.Router();

//GET
ReviewRoute.get("/", getAllReviews);
ReviewRoute.get("/:id", getSingleReview);
//POST
ReviewRoute.post("/createReview", authenticateUser, authorizePermissions("user"), createReview);
//PATCH
ReviewRoute.patch("/:id", authenticateUser, authorizePermissions("user"), updateReview);

//DELETE
ReviewRoute.delete("/:id", authenticateUser, authorizePermissions("user"), deleteReview);

export default ReviewRoute;
