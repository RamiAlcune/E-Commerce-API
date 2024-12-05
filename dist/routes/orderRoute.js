"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderController_1 = require("../controllers/orderController");
const express_1 = __importDefault(require("express"));
const authorazition_1 = require("../middlewares/authorazition");
const orderRouter = express_1.default.Router();
//Authenticate User is Alawys used:
orderRouter.use(authorazition_1.authenticateUser);
//GET
orderRouter.get("/", (0, authorazition_1.authorizePermissions)("admin"), orderController_1.getAllOrders);
orderRouter.get("/:id", orderController_1.getSingleOrder);
orderRouter.get("/showAllMyOrders", orderController_1.getCurrentUserOrders);
//POST
orderRouter.post("/createOrder", (0, authorazition_1.authorizePermissions)("user", "admin"), orderController_1.createOrder);
//PATCH
orderRouter.patch("/:id", (0, authorazition_1.authorizePermissions)("user", "admin"), orderController_1.updateOrder);
exports.default = orderRouter;
