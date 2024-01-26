import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  coreErrors,
  registrationFieldsErrors,
} from "../../exceptions/messages";
import { ApiError, ApiErrorRes, HttpCode } from "../../exceptions/ApiError";
import AuthService from "../../services/auth";

const AuthController = {
  async registration(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const validationErrors = {
          httpCode: HttpCode.badRequest,
          description: errors
            .array()
            .map((el) => registrationFieldsErrors[el.param])[0],
        };
        throw new ApiError(validationErrors);
      }

      const { nickname, password, email } = req.body;

      if (!nickname && !email && !password) {
        throw new ApiError({
          httpCode: HttpCode.badRequest,
          description: coreErrors.notFields,
        });
      }

      const { status } = await AuthService.registration({
        email,
        password,
        nickname,
      });

      res.status(status).send();
    } catch (error: unknown) {
      const apiError = error as ApiErrorRes;
      res.status(apiError.httpCode).send({ description: apiError.description });
    }
  },
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email && !password) {
        throw new ApiError({
          httpCode: HttpCode.badRequest || 500,
          description: coreErrors.notFields,
        });
      }

      const accessToken = await AuthService.login({ email, password });

      res.cookie("accessToken", accessToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.status(HttpCode.success).send();
    } catch (error: unknown) {
      const apiError = error as ApiErrorRes;
      res.status(apiError.httpCode).send({ description: apiError.description });
    }
  },
  async checkAuthorized(req: Request, res: Response) {
    try {
      const { accessToken } = req.cookies;

      const { isAuthorized } = await AuthService.checkAuthorized({
        accessToken,
      });

      res.status(isAuthorized ? HttpCode.success : HttpCode.badRequest).send();
    } catch (error: unknown) {
      const apiError = error as ApiErrorRes;
      res.status(apiError.httpCode).send({ description: apiError.description });
    }
  },
  async logout(_: Request, res: Response) {
    try {
      res.clearCookie("accessToken");

      return res.status(HttpCode.success).send();
    } catch (error: unknown) {
      const apiError = error as ApiErrorRes;
      res.status(apiError.httpCode).send({ description: apiError.description });
    }
  },
};

export default AuthController;
