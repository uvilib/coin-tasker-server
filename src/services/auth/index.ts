import bcrypt from "bcrypt";
import UserModel from "../../models/user";
import { ApiError, HttpCode } from "../../exceptions/ApiError";
import { loginErrors, registrationErrors } from "../../exceptions/messages";
import { TokenService } from "../token";
import { Response } from "express";

const AuthService = {
  async registration({
    nickname,
    password,
    email,
  }: {
    nickname: string;
    password: string;
    email: string;
  }) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw new ApiError({
        httpCode: HttpCode.badRequest,
        description: registrationErrors.userExists,
      });
    }

    const hashPassword = await bcrypt.hash(password, 7);

    await UserModel.create({
      nickname,
      email,
      password: hashPassword,
      isActivated: false,
    });

    return { status: 200 };
  },
  async login({
    email,
    password,
    res,
  }: {
    email: string;
    password: string;
    res: Response;
  }) {
    const candidate = await UserModel.findOne({ email });

    if (!candidate) {
      throw new ApiError({
        httpCode: HttpCode.badRequest || 500,
        description: loginErrors.userNotFound,
      });
    }

    const isPassEquals = await bcrypt.compare(password, candidate.password);

    if (!isPassEquals) {
      throw new ApiError({
        httpCode: HttpCode.badRequest || 500,
        description: loginErrors.wrongCredentials,
      });
    }

    return TokenService.generateToken({ _id: candidate._id });
  },
};

export default AuthService;
