import { Router } from "express";
import {
  listarGaleria,
  listarTodaGaleria,
  buscarPublicacao,
  criarPublicacao,
  atualizarPublicacao,
  excluirPublicacao
} from "../controllers/galleryController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.get("/", listarGaleria);
router.get("/admin/all", adminAuth, listarTodaGaleria);
router.get("/:id", buscarPublicacao);

router.post("/", adminAuth, criarPublicacao);
router.put("/:id", adminAuth, atualizarPublicacao);
router.delete("/:id", adminAuth, excluirPublicacao);

export default router;