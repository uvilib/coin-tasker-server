import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const TokenService = {
  generateToken({ _id }: { _id: Types.ObjectId }) {
    return jwt.sign(
      { _id },
      process.env.JWT_ACCESS_SECRET || "jwtAccessSecret",
    );
  },
  validateAccessToken({ accessToken }: { accessToken: string }) {
    const verify = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET || "jwtAccessSecret",
    );
    return Boolean(verify);
  },
  getVerifyAccessToken({ accessToken }: { accessToken: string }) {
    return jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET || "jwtAccessSecret",
    );
  },
};
