import express from "express";
import { initiateMulterStorage } from "../../utils/mongoose";
import { AuthMiddleware } from "../../middlewares/auth";
import { UserController } from "../../controllers/user";
const router = express.Router();

const upload = initiateMulterStorage();

router.post(
  "/upload/avatar",
  upload.single("avatar"),
  AuthMiddleware,
  UserController.uploadAvatar,
);
router.get("/avatar/:filename", AuthMiddleware, UserController.streamAvatar);

export default router;
