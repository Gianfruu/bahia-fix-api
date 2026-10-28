import { Router } from "express";
import { clientes, filterAndPaginate, parsePagination } from "../data/mock-data.js";

const router = Router();

router.get("/", (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const data = filterAndPaginate(clientes, req.query.q, page, limit);

  res.status(200).json({ success: true, data, message: "Listado de clientes obtenido correctamente." });
});

router.get("/:id", (req, res) => {
  const cliente = clientes.find((item) => String(item.id) === req.params.id);

  if (!cliente) {
    return res.status(404).json({ success: false, data: null, message: "No se encontró el cliente solicitado." });
  }

  return res.status(200).json({ success: true, data: cliente, message: "Cliente obtenido correctamente." });
});

export default router;
