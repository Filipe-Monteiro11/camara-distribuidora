import multer from "multer";
import path from "node:path";
import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";

export const curriculosDir = path.resolve("private/curriculos");

mkdirSync(curriculosDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, curriculosDir);
  },

  filename(req, file, callback) {
    callback(null, `${randomUUID()}.pdf`);
  }
});

function validarArquivo(req, file, callback) {
  const extensao = path.extname(file.originalname).toLowerCase();

  if (
    file.mimetype !== "application/pdf" ||
    extensao !== ".pdf"
  ) {
    return callback(
      new Error("Envie apenas arquivos PDF.")
    );
  }

  callback(null, true);
}

export const uploadCurriculo = multer({
  storage,
  fileFilter: validarArquivo,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 5
  }
}).single("curriculo");