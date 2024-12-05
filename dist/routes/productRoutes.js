"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const authorazition_1 = require("../middlewares/authorazition");
const ProductRouter = express_1.default.Router();
//Authenticate User is Alawys used:
ProductRouter.use(authorazition_1.authenticateUser);
//GET
ProductRouter.get("/", productController_1.getAllProducts);
ProductRouter.get("/:id", productController_1.getSingleProduct);
ProductRouter.get("/:id/reviews", productController_1.getSingleProductReviews);
//POST
ProductRouter.post("/createProduct", (0, authorazition_1.authorizePermissions)("admin"), productController_1.createProduct);
//UploadImage
ProductRouter.post("/uploadImage", (0, authorazition_1.authorizePermissions)("admin"), productController_1.uploadImage);
//PATCH
ProductRouter.patch("/:id", (0, authorazition_1.authorizePermissions)("admin"), productController_1.updateProduct);
//DELETE
ProductRouter.delete("/:id", (0, authorazition_1.authorizePermissions)("admin"), productController_1.deleteProduct);
exports.default = ProductRouter;
