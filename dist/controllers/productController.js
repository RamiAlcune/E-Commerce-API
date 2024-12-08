"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleProductReviews = exports.uploadImage = exports.deleteProduct = exports.updateProduct = exports.getSingleProduct = exports.getAllProducts = exports.createProduct = void 0;
const ProductModel_1 = require("../models/ProductModel");
const ValidationProducts_1 = require("../utils/ValidationProducts");
const http_status_codes_1 = require("http-status-codes");
const bad_request_1 = require("../errors/bad-request");
const path_1 = __importDefault(require("path"));
const createProduct = async (req, res) => {
    const ProductData = req.body;
    ProductData.user_id = req.user.id;
    const validationErrors = (0, ValidationProducts_1.validateProductData)(ProductData);
    if (validationErrors.length > 0) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ Required: validationErrors, status: false });
        return;
    }
    const Product = await (0, ProductModel_1.createProducts)(ProductData);
    if (!Product) {
        res.status(401).json({ msg: "There is an issue with the database. Please try again later", status: false });
        return;
    }
    if (!Product.id_product) {
        res.status(404).json({ msg: "ERROR!", status: false });
    }
    const id = Product.id_product;
    const CreatedProduct = await (0, ProductModel_1.GetSingleProduct)(id);
    res.status(201).json({ data: CreatedProduct, status: true });
};
exports.createProduct = createProduct;
const getAllProducts = async (req, res) => {
    const Products = await (0, ProductModel_1.GetProducts)();
    if (!Products) {
        res.status(404).json({ msg: "There is no Products", status: false });
        return;
    }
    res.status(200).json({ data: Products, status: true });
};
exports.getAllProducts = getAllProducts;
const getSingleProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(id);
    const Product = await (0, ProductModel_1.GetSingleProduct)(id);
    if (!Product) {
        res.status(404).json({ msg: "This Product is not available.", status: false });
        return;
    }
    res.status(200).json({ data: Product, status: true });
};
exports.getSingleProduct = getSingleProduct;
const updateProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    const updatedData = await (0, ProductModel_1.updateProducts)(updateData, id);
    if (!updateData) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ msg: "Fail To Update", status: false });
        return;
    }
    const ProductAfterUpdate = await (0, ProductModel_1.GetSingleProduct)(id);
    res.status(201).json({ data: ProductAfterUpdate, status: true });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    const DeletedData = await (0, ProductModel_1.deleteProducts)(id);
    if (!DeletedData) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ msg: "The Product you trying to delete is not available", status: false });
        return;
    }
    res.status(200).json({ msg: "The Product has Been Deleted.", status: true });
};
exports.deleteProduct = deleteProduct;
const uploadImage = async (req, res) => {
    if (!req.files) {
        throw new bad_request_1.BadRequestError("No File Uploaded");
    }
    const productImage = req.files.image;
    if (!productImage.mimetype.startsWith("image")) {
        throw new bad_request_1.BadRequestError("Please Upload Image");
    }
    const maxsize = 1024 * 1024;
    if (productImage.size > maxsize) {
        throw new bad_request_1.BadRequestError("Please Upload an image with smallar than 1MB");
    }
    const imagePath = path_1.default.join(__dirname, `../../public/uploads/` + `${productImage.name}`);
    console.log(imagePath);
    await productImage.mv(imagePath);
    res.status(200).json({ image: `/uploads/${productImage.name}` });
};
exports.uploadImage = uploadImage;
const getSingleProductReviews = async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
        throw new bad_request_1.BadRequestError("Please Provide product ID!");
    }
    const data = await (0, ProductModel_1.GetSingleProductReviews)(id);
    res.status(200).json({ data: data, status: true });
};
exports.getSingleProductReviews = getSingleProductReviews;
