import { timingSafeEqual } from "node:crypto";

export function adminAuth(req, res, next) {
  const secret = process.env.ADMIN_API_KEY;
  const provided = req.get("x-admin-key");

  if (!secret || !provided) {
    return res.status(401).json({
      error: "Autenticação necessária."
    });
  }

  const expected = Buffer.from(secret);
  const received = Buffer.from(provided);

  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return res.status(401).json({
      error: "Credenciais inválidas."
    });
  }

  next();
}