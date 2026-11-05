import { Router } from "express";
import multer from "multer";
import { adminAuth } from "../middleware/adminAuth.js";
import { upload } from "../middleware/upload.js";
import { enviarImagem } from "../controllers/uploadController.js";

const router = Router();

router.post(
  "/",
  adminAuth,
  (req, res, next) => {
    upload.single("imagem")(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        return res.status(400).json({
          error: error.code === "LIMIT_FILE_SIZE"
            ? "A imagem deve ter no máximo 20 MB."
            : "Arquivo inválido."
        });
      }

      if (error) {
        return res.status(400).json({
          error: error.message
        });
      }

      next();
    });
  },
  enviarImagem
);

export default router;