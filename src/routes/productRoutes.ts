import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
  getSingleProductReviews,
} from "../controllers/productController";
import { authenticateUser, authorizePermissions } from "../middlewares/authorazition";
const ProductRouter = express.Router();

//Authenticate User is Alawys used:
ProductRouter.use(authenticateUser);

//GET
ProductRouter.get("/", getAllProducts);
ProductRouter.get("/:id", getSingleProduct);
ProductRouter.get("/:id/reviews", getSingleProductReviews);
//POST
ProductRouter.post("/createProduct", authorizePermissions("admin"), createProduct);
//UploadImage
ProductRouter.post("/uploadImage", authorizePermissions("admin"), uploadImage);
//PATCH
ProductRouter.patch("/:id", authorizePermissions("admin"), updateProduct);
//DELETE
ProductRouter.delete("/:id", authorizePermissions("admin"), deleteProduct);
export default ProductRouter;
