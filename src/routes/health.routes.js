import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: "ok", service: "bahia-fix-api" },
    message: "API disponible."
  });
});

export default router;
