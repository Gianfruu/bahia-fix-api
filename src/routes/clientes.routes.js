
import { Router } from "express";
import {
  clientes,
  equipos,
  filterAndPaginate,
  parsePagination,
  validateCliente
} from "../data/mock-data.js";

const router = Router();

// Obtener listado de clientes
router.get("/", (req, res) => {
  const { page, limit } = parsePagination(req.query);

  return res.status(200).json({
    success: true,
    data: filterAndPaginate(clientes, req.query.q, page, limit),
    message: "Listado de clientes obtenido correctamente."
  });
});

// Obtener cliente por ID
router.get("/:id", (req, res) => {
  const cliente = clientes.find(
    (item) => String(item.id) === req.params.id
  );

  if (!cliente) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "No se encontró el cliente solicitado."
    });
  }

  return res.status(200).json({
    success: true,
    data: cliente,
    message: "Cliente obtenido correctamente."
  });
});

// Registrar cliente
router.post("/", (req, res) => {
  const missing = validateCliente(req.body || {});

  if (missing.length) {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Campos obligatorios: ${missing.join(", ")}.`
    });
  }

  const cliente = {
    id: Math.max(0, ...clientes.map((item) => item.id)) + 1,
    ...Object.fromEntries(
      ["nombre", "apellido", "telefono", "email", "localidad"].map(
        (key) => [key, req.body[key].trim()]
      )
    )
  };

  clientes.push(cliente);

  return res.status(201).json({
    success: true,
    data: cliente,
    message: "Cliente registrado correctamente."
  });
});

// Actualizar cliente
router.put("/:id", (req, res) => {
  const cliente = clientes.find(
    (item) => String(item.id) === req.params.id
  );

  if (!cliente) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "No se encontró el cliente solicitado."
    });
  }

  const missing = validateCliente(req.body || {});

  if (missing.length) {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Campos obligatorios: ${missing.join(", ")}.`
    });
  }

  ["nombre", "apellido", "telefono", "email", "localidad"].forEach(
    (key) => {
      cliente[key] = req.body[key].trim();
    }
  );

  return res.status(200).json({
    success: true,
    data: cliente,
    message: "Cliente actualizado correctamente."
  });
});

// Eliminar cliente
router.delete("/:id", (req, res) => {
  const index = clientes.findIndex(
    (item) => String(item.id) === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "No se encontró el cliente solicitado."
    });
  }

  const equiposAsociados = equipos.filter(
    (item) => String(item.clienteId) === req.params.id
  );

  if (equiposAsociados.length > 0) {
    return res.status(409).json({
      success: false,
      data: null,
      message: `No se puede eliminar el cliente porque todavía tiene ${equiposAsociados.length} equipo(s) asociado(s). Eliminá primero esos equipos.`
    });
  }

  const [deleted] = clientes.splice(index, 1);

  return res.status(200).json({
    success: true,
    data: deleted,
    message: "Cliente eliminado correctamente."
  });
});

export default router;
