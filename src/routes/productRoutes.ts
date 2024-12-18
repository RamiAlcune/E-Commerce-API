import express, { RequestHandler } from "express";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct, uploadImage, getSingleProductReviews } from "../controllers/productController";
import { authenticateUser, authorizePermissions } from "../middlewares/authorazition";
const ProductRouter = express.Router();

//GET
ProductRouter.get("/", getAllProducts);
ProductRouter.get("/:id", getSingleProduct);
ProductRouter.get("/:id/reviews", getSingleProductReviews);
//POST
ProductRouter.post("/createProduct", authenticateUser as RequestHandler, authorizePermissions("user"), createProduct);
//UploadImage
ProductRouter.post("/uploadImage", authenticateUser as RequestHandler, authorizePermissions("user"), uploadImage);
//PATCH
ProductRouter.patch("/:id", authenticateUser as RequestHandler, authorizePermissions("user"), updateProduct);
//DELETE
ProductRouter.delete("/:id", authenticateUser as RequestHandler, authorizePermissions("user"), deleteProduct);
export default ProductRouter;
