import express from "express";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct, uploadImage, getSingleProductReviews } from "../controllers/productController";
import { authenticateUser, authorizePermissions } from "../middlewares/authorazition";
const ProductRouter = express.Router();

//Authenticate User is Alawys used:
ProductRouter.use(authenticateUser);

//GET
ProductRouter.get("/", getAllProducts);
ProductRouter.get("/:id", getSingleProduct);
ProductRouter.get("/:id/reviews", getSingleProductReviews);
//POST
ProductRouter.post("/createProduct", authorizePermissions("user", "admin"), createProduct);
//UploadImage
ProductRouter.post("/uploadImage", authorizePermissions("user", "admin"), uploadImage);
//PATCH
ProductRouter.patch("/:id", authorizePermissions("user", "admin"), updateProduct);
//DELETE
ProductRouter.delete("/:id", authorizePermissions("user", "admin"), deleteProduct);
export default ProductRouter;
