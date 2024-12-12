import { Request, Response } from "express";
import {
  GetProducts,
  GetSingleProduct,
  updateProducts,
  deleteProducts,
  ProductsI,
  createProducts,
  GetSingleProductReviews,
} from "../models/ProductModel";
import { validateProductData } from "../utils/ValidationProducts";
import { StatusCodes } from "http-status-codes";
import Cloudnariy from "../utils/Cloudnariy";
import { BadRequestError } from "../errors/bad-request";
import fileUpload, { UploadedFile } from "express-fileupload";
import path from "path";
export const createProduct = async (req: Request, res: Response) => {
  const ProductData: ProductsI = req.body;
  ProductData.user_id = req.user.id;
  const validationErrors = validateProductData(ProductData);
  if (validationErrors.length > 0) {
    res.status(StatusCodes.BAD_REQUEST).json({ Required: validationErrors, status: false });
    return;
  }
  const Product = await createProducts(ProductData);
  if (!Product) {
    res.status(401).json({ msg: "There is an issue with the database. Please try again later", status: false });
    return;
  }
  if (!Product.id_product) {
    res.status(404).json({ msg: "ERROR!", status: false });
  }
  const id = Product.id_product;
  const CreatedProduct = await GetSingleProduct(id!);
  res.status(201).json({ data: CreatedProduct, status: true });
};

export const getAllProducts = async (req: Request, res: Response) => {
  const Products = await GetProducts();
  if (!Products) {
    res.status(404).json({ msg: "There is no Products", status: false });
    return;
  }
  res.status(200).json({ data: Products, status: true });
};

export const getSingleProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  console.log(id);
  const Product = await GetSingleProduct(id);
  if (!Product) {
    res.status(404).json({ msg: "This Product is not available.", status: false });
    return;
  }
  res.status(200).json({ data: Product, status: true });
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const updateData: ProductsI = req.body;
  const updatedData = await updateProducts(updateData, id);
  if (!updateData) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "Fail To Update", status: false });
    return;
  }
  const ProductAfterUpdate = await GetSingleProduct(id);
  res.status(201).json({ data: ProductAfterUpdate, status: true });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const DeletedData = await deleteProducts(id);
  if (!DeletedData) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "The Product you trying to delete is not available", status: false });
    return;
  }
  res.status(200).json({ msg: "The Product has Been Deleted.", status: true });
};

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.files) {
    throw new BadRequestError("No File Uploaded");
  }
  const productImage = req.files.image as UploadedFile;
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please Upload Image");
  }

  const maxsize = 1024 * 1024;
  if (productImage.size > maxsize) {
    throw new BadRequestError("Please Upload an image with smallar than 1MB");
  }
  const imagePath = path.join(__dirname, `../../public/uploads/` + `${productImage.name}`);
  console.log(imagePath);
  await productImage.mv(imagePath);
  res.status(200).json({ image: `/uploads/${productImage.name}` });
};

export const getSingleProductReviews = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (!id) {
    throw new BadRequestError("Please Provide product ID!");
  }
  const data = await GetSingleProductReviews(id);
  res.status(200).json({ data: data, status: true });
};
