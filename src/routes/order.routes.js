import express from "express";

import {
  createOrder,
  getOrders,
  getOrder,
} from "../controllers/order.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

import {
  createOrderSchema,
  orderIdSchema,
} from "../validators/order.validator.js";

const router = express.Router();

// Protect every order route
router.use(authenticate);

router.post(
  "/",
  validate(createOrderSchema),
  asyncHandler(createOrder)
);

router.get(
  "/",
  asyncHandler(getOrders)
);

router.get(
  "/:id",
  validate(orderIdSchema),
  asyncHandler(getOrder)
);

export default router;