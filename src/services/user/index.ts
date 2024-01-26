import UserModel from "../../models/user";
import { ApiError, HttpCode } from "../../exceptions/ApiError";
import { coreErrors } from "../../exceptions/messages";

export const UserService = {
  async uploadAvatar({ _id, filename }: { _id: string; filename: string }) {
    const user = await UserModel.findOne({
      _id,
    });

    if (!user || !filename) {
      throw new ApiError({
        httpCode: HttpCode.notFound || 500,
        description: coreErrors.notFound,
      });
    }

    user.avatar = `${process.env.API_URL || "http://localhost:5000"}/user/avatar/${filename}`;

    user.save();

    return { status: 200 };
  },
};
