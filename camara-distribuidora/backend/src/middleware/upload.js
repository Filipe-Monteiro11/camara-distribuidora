
import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";

export const uploadDir = path.resolve(
  process.env.UPLOAD_DIR || "uploads"
);

export const uploadTempDir = path.resolve(
  process.env.UPLOAD_TEMP_DIR || "private/uploads-temp"
);

mkdirSync(uploadDir, { recursive: true });
mkdirSync(uploadTempDir, { recursive: true });

const formatos = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

const storage = multer.diskStorage({
  destination: uploadTempDir,

  filename(req, file, callback) {
    const extensao = formatos[file.mimetype];

    callback(null, `${randomUUID()}${extensao}`);
  }
});

function validarArquivo(req, file, callback) {
  if (!formatos[file.mimetype]) {
    return callback(
      new Error("Envie uma imagem JPG, PNG ou WebP.")
    );
  }

  callback(null, true);
}

export const upload = multer({
  storage,
  fileFilter: validarArquivo,
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 1,
    fields: 0,
    parts: 1
  }
});
