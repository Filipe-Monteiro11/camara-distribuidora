import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";

export const uploadDir = path.resolve("uploads");

mkdirSync(uploadDir, { recursive: true });

const formatos = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

const storage = multer.diskStorage({
  destination: uploadDir,

  filename(req, file, callback) {
    const extensao = formatos[file.mimetype];

    callback(null, `${randomUUID()}${extensao}`);
  }
});

const fileFilter = (req, file, callback) => {
  if (!formatos[file.mimetype]) {
    return callback(new Error("Envie uma imagem JPG, PNG ou WebP."));
  }

  callback(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 1
  }
});