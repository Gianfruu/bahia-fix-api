
import { Router } from "express";
import {
  clientes,
  equipos,
  filterAndPaginate,
  parsePagination,
  validateEquipo
} from "../data/mock-data.js";

const router = Router();

// Obtener listado de equipos
router.get("/", (req, res) => {
  const { page, limit } = parsePagination(req.query);

  return res.status(200).json({
    success: true,
    data: filterAndPaginate(equipos, req.query.q, page, limit),
    message: "Listado de equipos obtenido correctamente."
  });
});

// Obtener equipo por ID
router.get("/:id", (req, res) => {
  const equipo = equipos.find(
    (item) => String(item.id) === req.params.id
  );

  if (!equipo) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "No se encontró el equipo solicitado."
    });
  }

  return res.status(200).json({
    success: true,
    data: equipo,
    message: "Equipo obtenido correctamente."
  });
});

// Registrar equipo
router.post("/", (req, res) => {
  const missing = validateEquipo(req.body || {});

  if (missing.length) {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Campos obligatorios: ${missing.join(", ")}.`
    });
  }

  const clienteExiste = clientes.some(
    (cliente) => String(cliente.id) === String(req.body.clienteId)
  );

  if (!clienteExiste) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Seleccioná un cliente existente."
    });
  }

  const equipo = {
    id: Math.max(100, ...equipos.map((item) => item.id)) + 1,
    clienteId: Number(req.body.clienteId),
    ...Object.fromEntries(
      ["tipo", "marca", "modelo", "numeroSerie", "estado", "garantia"].map(
        (key) => [key, req.body[key].trim()]
      )
    )
  };

  equipos.push(equipo);

  return res.status(201).json({
    success: true,
    data: equipo,
    message: "Equipo registrado correctamente."
  });
});

// Actualizar equipo
router.put("/:id", (req, res) => {
  const equipo = equipos.find(
    (item) => String(item.id) === req.params.id
  );

  if (!equipo) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "No se encontró el equipo solicitado."
    });
  }

  const missing = validateEquipo(req.body || {});

  if (missing.length) {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Campos obligatorios: ${missing.join(", ")}.`
    });
  }

  const clienteExiste = clientes.some(
    (cliente) => String(cliente.id) === String(req.body.clienteId)
  );

  if (!clienteExiste) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Seleccioná un cliente existente."
    });
  }

  ["tipo", "marca", "modelo", "numeroSerie", "estado", "garantia"].forEach(
    (key) => {
      equipo[key] = req.body[key].trim();
    }
  );

  equipo.clienteId = Number(req.body.clienteId);

  return res.status(200).json({
    success: true,
    data: equipo,
    message: "Equipo actualizado correctamente."
  });
});

// Eliminar equipo
router.delete("/:id", (req, res) => {
  const index = equipos.findIndex(
    (item) => String(item.id) === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "No se encontró el equipo solicitado."
    });
  }

  const [deleted] = equipos.splice(index, 1);

  return res.status(200).json({
    success: true,
    data: deleted,
    message: "Equipo eliminado correctamente."
  });
});

export default router;
