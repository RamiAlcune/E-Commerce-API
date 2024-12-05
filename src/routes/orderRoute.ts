import { getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder } from "../controllers/orderController";
import express from "express";
import { authenticateUser, authorizePermissions } from "../middlewares/authorazition";
const orderRouter = express.Router();

//Authenticate User is Alawys used:
orderRouter.use(authenticateUser);

//GET
orderRouter.get("/", authorizePermissions("admin"), getAllOrders);
orderRouter.get("/:id", getSingleOrder);
orderRouter.get("/showAllMyOrders", getCurrentUserOrders);
//POST
orderRouter.post("/createOrder", authorizePermissions("user", "admin"), createOrder);

//PATCH
orderRouter.patch("/:id", authorizePermissions("user", "admin"), updateOrder);
export default orderRouter;
