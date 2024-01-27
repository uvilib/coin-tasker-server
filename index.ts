import express, { Express } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import auth from "./src/routers/auth";
import { initiateMongoConnection } from "./src/utils/mongoose";
import user from "./src/routers/user";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(
  "/auth",
  express.json(),
  cors({ origin: "http://localhost:5173", credentials: true }),
  auth,
);
app.use(
  "/user",
  express.json(),
  cors({ origin: "http://localhost:5173", credentials: true }),
  user,
);

(async () => {
  await initiateMongoConnection();
  app.listen(port, () => console.log(`Server started on PORT = ${port}`));
})();
