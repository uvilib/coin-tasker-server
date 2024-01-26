import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError, ApiErrorRes, HttpCode } from "../../exceptions/ApiError";
import { UserService } from "../../services/user";
import { coreErrors } from "../../exceptions/messages";
import {
  initiateGridFsBucket,
  initiateMongoConnection,
  initiateMongoGridFs,
} from "../../utils/mongoose";
import { TokenService } from "../../services/token";

export const UserController = {
  async uploadAvatar(req: Request, res: Response) {
    try {
      const { accessToken } = req.cookies;

      const tokenData = TokenService.getVerifyAccessToken({ accessToken });

      await UserService.uploadAvatar({
        _id: (tokenData as jwt.JwtPayload)._id,
        filename: req?.file?.filename!,
      });

      res.status(HttpCode.success).send();
    } catch (error: unknown) {
      const apiError = error as ApiErrorRes;
      res.status(apiError.httpCode).send({ description: apiError.description });
    }
  },
  async streamAvatar(req: Request, res: Response) {
    try {
      const connect = await initiateMongoConnection();
      const gridFs = initiateMongoGridFs(connect.connection.db);
      const gridFsBucket = await initiateGridFsBucket(connect.connection.db);

      const file = await gridFs.files.findOne({
        filename: req.params.filename,
      });

      if (!file?.filename) {
        throw new ApiError({
          httpCode: HttpCode.notFound || 500,
          description: coreErrors.notFound,
        });
      }

      gridFsBucket.openDownloadStreamByName(file.filename).pipe(res);
    } catch (error: unknown) {
      const apiError = error as ApiErrorRes;
      res.status(apiError.httpCode).send({ description: apiError.description });
    }
  },
};
