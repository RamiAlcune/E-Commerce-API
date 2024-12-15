import express, { RequestHandler } from "express";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct, uploadImage, getSingleProductReviews } from "../controllers/productController";
import { authenticateUser, authorizePermissions } from "../middlewares/authorazition";
const ProductRouter = express.Router();

//Authenticate User is Alawys used:
ProductRouter.use(authenticateUser as RequestHandler);

//GET
ProductRouter.get("/", getAllProducts);
ProductRouter.get("/:id", getSingleProduct);
ProductRouter.get("/:id/reviews", getSingleProductReviews);
//POST
ProductRouter.post("/createProduct", authorizePermissions("user"), createProduct);
//UploadImage
ProductRouter.post("/uploadImage", authorizePermissions("user"), uploadImage);
//PATCH
ProductRouter.patch("/:id", authorizePermissions("user"), updateProduct);
//DELETE
ProductRouter.delete("/:id", authorizePermissions("user"), deleteProduct);
export default ProductRouter;
