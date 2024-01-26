import express from "express";
import { body } from "express-validator";
import { emailField, nicknameField, passwordField } from "../../constants/auth";
import AuthController from "../../controllers/auth";

const router = express.Router();

router.post(
  "/registration",
  body(nicknameField).isLength({ min: 4, max: 42 }),
  body(emailField).isEmail(),
  body(passwordField).isLength({ min: 8, max: 42 }),
  AuthController.registration,
);
router.post("/login", AuthController.login);
router.get("/check-auth", AuthController.checkAuthorized);
router.get("/logout", AuthController.logout);

export default router;
