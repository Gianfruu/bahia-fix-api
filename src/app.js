import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

const apiPrefix = process.env.API_PREFIX || "/api/v1";

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Bahía Fix API está funcionando."
  });
});

app.get(`${apiPrefix}/health`, (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: "ok", service: "bahia-fix-api" },
    message: "API disponible."
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

export default app;
