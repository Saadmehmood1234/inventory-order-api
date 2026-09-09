import * as orderService from "../services/order.service.js";

export const createOrder = async (req, res) => {
  const order = await orderService.createOrder(
    req.user.id,
    req.validated.body.items
  );

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
};

export const getOrders = async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id);

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: orders,
  });
};

export const getOrder = async (req, res) => {
  const order = await orderService.getUserOrderById(
    req.user.id,
    req.validated.params.id
  );

  res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    data: order,
  });
};
