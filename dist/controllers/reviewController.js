"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.getSingleReview = exports.getAllReviews = exports.createReview = void 0;
const ReviewModel_1 = require("../models/ReviewModel");
const ProductModel_1 = require("../models/ProductModel");
const not_found_1 = require("../errors/not-found");
const bad_request_1 = require("../errors/bad-request");
const checkPermissions_1 = require("../utils/checkPermissions");
const createReview = async (req, res) => {
    const { id_product } = req.body;
    const isValidProduct = await (0, ProductModel_1.GetSingleProduct)(id_product);
    if (!isValidProduct) {
        throw new not_found_1.NotFoundError(`No product with id: ${id_product}`);
    }
    const AlreadySubmittedReview = await (0, ReviewModel_1.isReviewdByUser)(id_product, req.user.id);
    if (AlreadySubmittedReview) {
        throw new bad_request_1.BadRequestError("you already submitted one Review");
    }
    const Data = req.body;
    Data.id_user = req.user.id;
    console.log(Data);
    const review = await (0, ReviewModel_1.CreateReview)(Data);
    res.status(200).json({ data: Data, Review: review });
};
exports.createReview = createReview;
const getAllReviews = async (req, res) => {
    const reviews = await (0, ReviewModel_1.GetReviews)();
    if (!reviews) {
        throw new not_found_1.NotFoundError("no reviews are available");
    }
    res.status(200).json({ data: reviews, status: true });
};
exports.getAllReviews = getAllReviews;
const getSingleReview = async (req, res) => {
    const review = await (0, ReviewModel_1.GetSingleReview)(parseInt(req.params.id));
    if (!review) {
        throw new not_found_1.NotFoundError("this Review is not available");
    }
    res.status(200).json({ data: review, status: true });
};
exports.getSingleReview = getSingleReview;
const updateReview = async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
        throw new bad_request_1.BadRequestError("Please Provide Review ID!");
    }
    const isReviewExist = await (0, ReviewModel_1.GetSingleReview)(id);
    if (!isReviewExist) {
        throw new not_found_1.NotFoundError("The Review id is not exist.");
    }
    const UpdatedData = req.body;
    (0, checkPermissions_1.checkPermissions)(req.user, isReviewExist.id_user);
    const updatedReview = await (0, ReviewModel_1.UpdateReview)(UpdatedData, id);
    res.status(201).json({ data: updatedReview, status: true });
};
exports.updateReview = updateReview;
const deleteReview = async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
        throw new bad_request_1.BadRequestError("Please Provide Review ID!");
    }
    const review = await (0, ReviewModel_1.GetSingleReview)(id);
    if (!review) {
        throw new not_found_1.NotFoundError("this Review is not available");
    }
    (0, checkPermissions_1.checkPermissions)(req.user, review.id_user);
    const deleteReview = await (0, ReviewModel_1.DeleteReview)(review.id_review);
    res.status(201).json({ msg: "Review Has Been Deleted.", status: true });
};
exports.deleteReview = deleteReview;
