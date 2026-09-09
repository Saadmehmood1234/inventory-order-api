import * as productService from "../services/product.service.js";

export const createProduct = async (req, res) => {
  const product = await productService.createProduct(
    req.validated.body
  );

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

export const getProducts = async (req, res) => {
  const result = await productService.getProducts(
    req.validated.query
  );

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: result,
  });
};

export const getProduct = async (req, res) => {
  const product = await productService.getProductById(
    req.validated.params.id
  );

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
};

export const updateProduct = async (req, res) => {
  const product = await productService.updateProduct(
    req.validated.params.id,
    req.validated.body
  );

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
};

export const deleteProduct = async (req, res) => {
  await productService.deleteProduct(
    req.validated.params.id
  );

  res.status(204).send();
};
