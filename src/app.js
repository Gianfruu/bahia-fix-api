import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";
import notFoundMiddleware from "./middlewares/not-found.middleware.js";

const app = express();
const apiPrefix = process.env.API_PREFIX || "/api/v1";

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: { service: "bahia-fix-api" },
    message: "Bahía Fix API está funcionando."
  });
});

app.use(apiPrefix, apiRoutes);
app.use(notFoundMiddleware);

export default app;
