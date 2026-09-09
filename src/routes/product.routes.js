import express from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  getProductsSchema,
} from "../validators/product.validator.js";

const router = express.Router();

// Public routes
router.get(
  "/",
  validate(getProductsSchema),
  asyncHandler(getProducts)
);

router.get(
  "/:id",
  validate(productIdSchema),
  asyncHandler(getProduct)
);

// Protected routes
router.post(
  "/",
  authenticate,
  validate(createProductSchema),
  asyncHandler(createProduct)
);

router.patch(
  "/:id",
  authenticate,
  validate(updateProductSchema),
  asyncHandler(updateProduct)
);

router.delete(
  "/:id",
  authenticate,
  validate(productIdSchema),
  asyncHandler(deleteProduct)
);

export default router;