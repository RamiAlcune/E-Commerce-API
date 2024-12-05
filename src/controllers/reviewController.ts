//- [] export (createReview, getAllReviews, getSingleReview, updateReview, deleteReview) functions
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import {
  GetReviews,
  CreateReview,
  GetSingleReview,
  DeleteReview,
  ReviewI,
  ReviewUpdateI,
  isReviewdByUser,
  UpdateReview,
} from "../models/ReviewModel";
import { GetSingleProduct } from "../models/ProductModel";
import { NotFoundError } from "../errors/not-found";
import { BadRequestError } from "../errors/bad-request";
import { checkPermissions } from "../utils/checkPermissions";

export const createReview = async (req: Request, res: Response) => {
  const { id_product } = req.body;
  const isValidProduct = await GetSingleProduct(id_product);
  if (!isValidProduct) {
    throw new NotFoundError(`No product with id: ${id_product}`);
  }

  const AlreadySubmittedReview = await isReviewdByUser(id_product, req.user.id);
  if (AlreadySubmittedReview) {
    throw new BadRequestError("you already submitted one Review");
  }
  const Data: ReviewI = req.body;
  Data.id_user = req.user.id;

  console.log(Data);
  const review = await CreateReview(Data);
  res.status(200).json({ data: Data, Review: review });
};

export const getAllReviews = async (req: Request, res: Response) => {
  const reviews = await GetReviews();
  if (!reviews) {
    throw new NotFoundError("no reviews are available");
  }
  res.status(200).json({ data: reviews, status: true });
};

export const getSingleReview = async (req: Request, res: Response) => {
  const review = await GetSingleReview(parseInt(req.params.id));
  if (!review) {
    throw new NotFoundError("this Review is not available");
  }
  res.status(200).json({ data: review, status: true });
};

export const updateReview = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (!id) {
    throw new BadRequestError("Please Provide Review ID!");
  }
  const isReviewExist = await GetSingleReview(id);
  if (!isReviewExist) {
    throw new NotFoundError("The Review id is not exist.");
  }
  const UpdatedData: ReviewUpdateI = req.body;
  checkPermissions(req.user, isReviewExist.id_user);
  const updatedReview = await UpdateReview(UpdatedData, id);
  res.status(201).json({ data: updatedReview, status: true });
};

export const deleteReview = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (!id) {
    throw new BadRequestError("Please Provide Review ID!");
  }
  const review = await GetSingleReview(id);
  if (!review) {
    throw new NotFoundError("this Review is not available");
  }
  checkPermissions(req.user, review.id_user);

  const deleteReview = await DeleteReview(review.id_review!);
  res.status(201).json({ msg: "Review Has Been Deleted.", status: true });
};
