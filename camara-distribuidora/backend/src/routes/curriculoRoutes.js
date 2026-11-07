import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import {
  enviarCurriculo,
  listarCurriculos,
  baixarCurriculo,
  atualizarStatusCurriculo,
  excluirCurriculo
} from "../controllers/curriculoController.js";

import { adminAuth } from "../middleware/adminAuth.js";
import { uploadCurriculo } from "../middleware/curriculoUpload.js";

const router = Router();

const limitarEnvios = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Muitas tentativas. Tente novamente mais tarde."
  }
});

router.post("/", limitarEnvios, (req, res) => {
  uploadCurriculo(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        error: error.code === "LIMIT_FILE_SIZE"
          ? "O currículo deve ter no máximo 5 MB."
          : error.message || "Não foi possível receber o arquivo."
      });
    }

    return enviarCurriculo(req, res);
  });
});

router.get("/admin/all", adminAuth, listarCurriculos);

router.get("/:id/download", adminAuth, baixarCurriculo);

router.patch("/:id/status", adminAuth, atualizarStatusCurriculo);

router.delete("/:id", adminAuth, excluirCurriculo);

export default router;