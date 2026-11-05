import { Router } from "express";
import {
  listarProdutos,
  listarTodosProdutos,
  buscarProduto,
  criarProduto,
  atualizarProduto,
  excluirProduto
} from "../controllers/productController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.get("/", listarProdutos);
router.get("/admin/all", adminAuth, listarTodosProdutos);
router.get("/:id", buscarProduto);

router.post("/", adminAuth, criarProduto);
router.put("/:id", adminAuth, atualizarProduto);
router.delete("/:id", adminAuth, excluirProduto);

export default router;