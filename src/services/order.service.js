import mongoose from "mongoose"

import {Product} from "../models/product.model.js"
import {Order} from "../models/order.model.js"

import {ApiError} from "../utils/api-error.js"

export const createOrder = async (
  userId,
  items
) => {
  const quantityMap = new Map();

  for (const item of items) {
    const current =
      quantityMap.get(item.productId) || 0;

    quantityMap.set(
      item.productId,
      current + item.quantity
    );
  }

  const normalizedItems =
    Array.from(
      quantityMap.entries()
    ).map(
      ([productId, quantity]) => ({
        productId,
        quantity,
      })
    );
  const session =
    await mongoose.startSession();

  try {
    let createdOrder;

    await session.withTransaction(
      async () => {
        const orderItems = [];

        let totalAmount = 0;

        for (const item of normalizedItems) {

          const product =
            await Product.findById(
              item.productId
            ).session(session);

          if (!product) {
            throw new ApiError(
              404,
              `Product ${item.productId} not found`
            );
          }

          const updatedProduct =
            await Product.findOneAndUpdate(
              {
                _id: product._id,

                stockQuantity: {
                  $gte: item.quantity,
                },
              },

              {
                $inc: {
                  stockQuantity:
                    -item.quantity,
                },
              },

              {
                new: true,
                session,
              }
            );

          if (!updatedProduct) {
            throw new ApiError(
              409,
              `Insufficient stock for "${product.name}"`
            );
          }
          const unitPrice =
            product.price;

          const subtotal =
            unitPrice * item.quantity;

          totalAmount += subtotal;

          orderItems.push({
            product: product._id,
            quantity: item.quantity,
            unitPrice,
            subtotal,
          });
        }
        const orders =
          await Order.create(
            [
              {
                user: userId,
                items: orderItems,
                totalAmount,
                status: "CONFIRMED",
              },
            ],
            {
              session,
            }
          );

        createdOrder = orders[0];
      }
    );

    await createdOrder.populate(
      "items.product",
      "name category"
    );

    return createdOrder;
  } finally {
    await session.endSession();
  }
};

export const getUserOrders = async (
  userId
) => {
  const orders =
    await Order.find({
      user: userId,
    })
      .populate(
        "items.product",
        "name category"
      )
      .sort({
        createdAt: -1,
      });

  return orders;
};

export const getUserOrderById = async (
  userId,
  orderId
) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new ApiError(
      400,
      "Invalid order ID"
    );
  }

  const order =
    await Order.findOne({
      _id: orderId,
      user: userId,
    }).populate(
      "items.product",
      "name category"
    );

  if (!order) {
    throw new ApiError(
      404,
      "Order not found"
    );
  }

  return order;
};
