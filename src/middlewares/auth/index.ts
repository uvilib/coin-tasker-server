import { NextFunction, Request, Response } from "express";
import { ApiError, ApiErrorRes, HttpCode } from "../../exceptions/ApiError";
import { TokenService } from "../../services/token";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw new ApiError({ httpCode: HttpCode.unauthorized });
    }

    const isAccessTokenValid = TokenService.validateAccessToken(accessToken);

    if (!isAccessTokenValid) {
      throw new ApiError({ httpCode: HttpCode.unauthorized });
    }

    next();
  } catch (error: unknown) {
    const apiError = error as ApiErrorRes;
    res.status(apiError.httpCode).send({ description: apiError.description });
  }
};
