import mongoose from "mongoose"

import {Product} from "../models/product.model.js"
import {ApiError} from "../utils/api-error.js"

const serializeProduct = (product) => ({
  id: product._id,
  name: product.name,
  description: product.description,
  price: product.price,
  stockQuantity: product.stockQuantity,
  category: product.category,
  createdAt: product.createdAt,
});

export const createProduct = async (data) => {
  const product = await Product.create(data);

  return serializeProduct(product);
};

export const getProducts = async ({
  search,
  category,
  inStock,
  page,
  limit,
}) => {
  const filter = {};

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    filter.category = {
      $regex: `^${category}$`,
      $options: "i",
    };
  }

  if (inStock === "true") {
    filter.stockQuantity = {
      $gt: 0,
    };
  }

  if (inStock === "false") {
    filter.stockQuantity = 0;
  }

  const skip = (page - 1) * limit;

  const [products, total] =
    await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Product.countDocuments(filter),
    ]);

  return {
    products: products.map(serializeProduct),

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
};

export const getProductById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(
      400,
      "Invalid product ID"
    );
  }

  const product =
    await Product.findById(id);

  if (!product) {
    throw new ApiError(
      404,
      "Product not found"
    );
  }

  return serializeProduct(product);
};

export const updateProduct = async (
  id,
  data
) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(
      400,
      "Invalid product ID"
    );
  }

  const product =
    await Product.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!product) {
    throw new ApiError(
      404,
      "Product not found"
    );
  }

  return serializeProduct(product);
};

export const deleteProduct = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(
      400,
      "Invalid product ID"
    );
  }

  const product =
    await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(
      404,
      "Product not found"
    );
  }
};
