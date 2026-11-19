
import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import {
  login,
  perfil,
  atualizarConta
} from "../controllers/authController.js";

import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

const limitarLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    error: "Muitas tentativas de login. Tente novamente em alguns minutos."
  }
});

router.post("/login", limitarLogin, login);

router.get("/me", adminAuth, perfil);

router.patch("/me", adminAuth, atualizarConta);

export default router;
