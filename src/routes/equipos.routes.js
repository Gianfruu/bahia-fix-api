import { Router } from "express";
import { equipos, filterAndPaginate, parsePagination } from "../data/mock-data.js";

const router = Router();

router.get("/", (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const data = filterAndPaginate(equipos, req.query.q, page, limit);

  res.status(200).json({ success: true, data, message: "Listado de equipos obtenido correctamente." });
});

router.get("/:id", (req, res) => {
  const equipo = equipos.find((item) => String(item.id) === req.params.id);

  if (!equipo) {
    return res.status(404).json({ success: false, data: null, message: "No se encontró el equipo solicitado." });
  }

  return res.status(200).json({ success: true, data: equipo, message: "Equipo obtenido correctamente." });
});

export default router;
