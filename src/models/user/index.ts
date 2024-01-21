import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  avatar: { type: String, required: false },
  nickname: { type: String, unique: false, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, immutable: true, default: () => new Date() },
});

const UserModel = model("user", UserSchema);

export default UserModel;
