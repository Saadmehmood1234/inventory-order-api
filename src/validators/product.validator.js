import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(200),

    description: z.string().trim().max(1000).optional(),

    price: z.number().positive(),

    stockQuantity: z.number().int().min(0),

    category: z.string().trim().min(1).max(100),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateProductSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).max(200).optional(),

      description: z.string().trim().max(1000).nullable().optional(),

      price: z.number().positive().optional(),

      stockQuantity: z.number().int().min(0).optional(),

      category: z.string().trim().min(1).max(100).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),

  params: z.object({
    id: objectId,
  }),

  query: z.object({}),
});

export const productIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    id: objectId,
  }),

  query: z.object({}),
});

export const getProductsSchema = z.object({
  body: z.object({}),

  params: z.object({}),

  query: z.object({
    search: z.string().trim().optional(),

    category: z.string().trim().optional(),

    inStock: z.enum(["true", "false"]).optional(),

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});


