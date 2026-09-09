import { z } from "zod"

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100),

    email: z
      .string()
      .trim()
      .email()
      .transform((value) => value.toLowerCase()),

    password: z
      .string()
      .min(6)
      .max(100),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email()
      .transform((value) => value.toLowerCase()),

    password: z
      .string()
      .min(1),
  }),

  params: z.object({}),

  query: z.object({}),
});

