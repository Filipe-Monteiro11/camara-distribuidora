import jwt from "jsonwebtoken";

export function adminAuth(req, res, next) {
  const authorization = req.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Autenticação necessária."
    });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"]
    });

    if (typeof payload !== "object" || !payload.adminId) {
      return res.status(401).json({
        error: "Token inválido."
      });
    }

    req.adminId = payload.adminId;
    next();
  } catch {
    return res.status(401).json({
      error: "Token inválido ou expirado."
    });
  }
}