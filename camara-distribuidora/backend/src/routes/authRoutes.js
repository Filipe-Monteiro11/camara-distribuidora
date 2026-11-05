import { Router } from "express";
import { login, perfil } from "../controllers/authController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.post("/login", login);
router.get("/me", adminAuth, perfil);

export default router;