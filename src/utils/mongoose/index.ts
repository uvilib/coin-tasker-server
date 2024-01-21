import mongoose from "mongoose";
import dotenv from "dotenv";
import { GridFsStorage } from "multer-gridfs-storage";
import GridFs from "gridfs-stream";
import crypto from "crypto";
import path from "path";
import multer from "multer";

dotenv.config();

export const initiateMongoConnection = async () =>
  await mongoose.connect(process.env.MONGOOSE_URI!);

export const initiateMulterStorage = () => {
  const storage = new GridFsStorage({
    url:
      process.env.MONGOOSE_URI ||
      "mongodb://127.0.0.1:27017/coin-tasker-database",
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename =
            buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename,
            bucketName: "uploads",
          };
          resolve(fileInfo);
        });
      });
    },
  });

  return multer({
    storage,
  });
};

export const initiateMongoGridFs = (db: mongoose.mongo.Db) => {
  const gridFs = GridFs(db, mongoose.mongo);
  gridFs.collection("uploads");
  return gridFs;
};

export const initiateGridFsBucket = (db: mongoose.mongo.Db) => {
  return new mongoose.mongo.GridFSBucket(db, {
    bucketName: "uploads",
  });
};
