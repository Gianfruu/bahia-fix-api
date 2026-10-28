import { Router } from "express";
import healthRoutes from "./health.routes.js";
import clientesRoutes from "./clientes.routes.js";
import equiposRoutes from "./equipos.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/clientes", clientesRoutes);
router.use("/equipos", equiposRoutes);

export default router;
