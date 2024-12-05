"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = exports.createOrder = exports.getCurrentUserOrders = exports.getSingleOrder = exports.getAllOrders = void 0;
const OrderModel_1 = require("../models/OrderModel");
const checkPermissions_1 = require("../utils/checkPermissions");
const getAllOrders = async (req, res) => {
    const orders = await (0, OrderModel_1.GetAllOrders)();
    if (!orders) {
        res.status(404).json({ msg: "There is no orders to show.", status: false });
    }
    res.status(200).json({ data: orders, status: true });
};
exports.getAllOrders = getAllOrders;
const getSingleOrder = async (req, res) => {
    const id = parseInt(req.params.id);
    const order = await (0, OrderModel_1.GetSingleOrder)(id);
    if (!order) {
        res.status(404).json({ msg: "There is no orders to show.", status: false });
    }
    (0, checkPermissions_1.checkPermissions)(req.user, order.id_user);
    res.status(200).json({ data: order, status: true });
};
exports.getSingleOrder = getSingleOrder;
const getCurrentUserOrders = async (req, res) => {
    res.send("getCurrentUserOrders");
};
exports.getCurrentUserOrders = getCurrentUserOrders;
const createOrder = async (req, res) => {
    res.send("createOrder");
};
exports.createOrder = createOrder;
const updateOrder = async (req, res) => {
    res.send("updateOrder");
};
exports.updateOrder = updateOrder;
