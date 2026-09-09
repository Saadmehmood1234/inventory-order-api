import { ApiError } from "../utils/api-error.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(
      new ApiError(401, "Authentication required")
    );
  }

  try {
    const payload = verifyToken(token);

    req.user = {
      id: payload.userId,
    };

    next();
  } catch (error) {
    return next(
      new ApiError(401, "Invalid or expired token")
    );
  }
};
