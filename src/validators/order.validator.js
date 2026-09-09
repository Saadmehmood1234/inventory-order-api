import { z } from "zod"

const objectId = z
  .string()
  .regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid product ID"
  );

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: objectId,

          quantity: z
            .number()
            .int()
            .positive(),
        })
      )
      .min(1),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const orderIdSchema = z.object({
  body: z.object({}),

  params: z.object({
    id: objectId,
  }),

  query: z.object({}),
});

