import express from "express";

import {
  register,
  logout,
  login,
} from "../controllers/auth.controller.js";

import { validate } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(register)
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(login)
);

router.post(
  "/logout",
  asyncHandler(logout)
);


export default router;