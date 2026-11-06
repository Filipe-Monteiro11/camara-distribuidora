import { Router } from "express";
import {
  listarReceitas,
  listarTodasReceitas,
  buscarReceita,
  criarReceita,
  atualizarReceita,
  excluirReceita
} from "../controllers/recipeController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.get("/", listarReceitas);
router.get("/admin/all", adminAuth, listarTodasReceitas);
router.get("/:id", buscarReceita);

router.post("/", adminAuth, criarReceita);
router.put("/:id", adminAuth, atualizarReceita);
router.delete("/:id", adminAuth, excluirReceita);

export default router;