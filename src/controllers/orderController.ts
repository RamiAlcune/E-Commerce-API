import { GetAllOrders, GetSingleOrder, GetCurrentUserOrders, CreateOrder } from "../models/OrderModel";
import { Request, Response } from "express";
import { checkPermissions } from "../utils/checkPermissions";
export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await GetAllOrders();
  if (!orders) {
    res.status(404).json({ msg: "There is no orders to show.", status: false });
  }
  res.status(200).json({ data: orders, status: true });
};

export const getSingleOrder = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const order = await GetSingleOrder(id);
  if (!order) {
    res.status(404).json({ msg: "There is no orders to show.", status: false });
  }
  checkPermissions(req.user, order!.id_user);
  res.status(200).json({ data: order, status: true });
};

export const getCurrentUserOrders = async (req: Request, res: Response) => {
  res.send("getCurrentUserOrders");
};

export const createOrder = async (req: Request, res: Response) => {
  res.send("createOrder");
};

export const updateOrder = async (req: Request, res: Response) => {
  res.send("updateOrder");
};
