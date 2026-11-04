import { Router } from "express";
import {
  clientes,
  equipos,
  reparaciones,
  filterAndPaginate,
  parsePagination
} from "../data/mock-data.js";

const router = Router();

function validar(data) {
  const obligatorios = [
    "clienteId",
    "equipoId",
    "fechaIngreso",
    "motivo",
    "estado"
  ];

  return obligatorios.filter((campo) =>
    data[campo] === undefined ||
    data[campo] === null ||
    String(data[campo]).trim() === ""
  );
}

function respuesta(res, status, data, message) {
  return res.status(status).json({ success: true, data, message });
}

// Listar órdenes con búsqueda, filtro por estado y paginación.
router.get("/", (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const estado = String(req.query.estado || "").trim().toLocaleLowerCase("es");
  let registros = reparaciones;

  if (estado) {
    registros = registros.filter(
      (item) => String(item.estado).toLocaleLowerCase("es") === estado
    );
  }

  const resultado = filterAndPaginate(
    registros,
    req.query.q || "",
    page,
    limit
  );

  return respuesta(
    res,
    200,
    resultado,
    "Listado de reparaciones obtenido correctamente."
  );
});

// Obtener una orden.
router.get("/:id", (req, res) => {
  const reparacion = reparaciones.find(
    (item) => String(item.id) === req.params.id
  );

  if (!reparacion) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "No se encontró la orden de reparación."
    });
  }

  return respuesta(res, 200, reparacion, "Orden obtenida correctamente.");
});

// Crear una orden.
router.post("/", (req, res) => {
  const data = req.body || {};
  const faltantes = validar(data);

  if (faltantes.length) {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Campos obligatorios: ${faltantes.join(", ")}.`
    });
  }

  const cliente = clientes.find(
    (item) => String(item.id) === String(data.clienteId)
  );
  const equipo = equipos.find(
    (item) => String(item.id) === String(data.equipoId)
  );

  if (!cliente || !equipo) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Seleccioná un cliente y un equipo existentes."
    });
  }

  if (String(equipo.clienteId) !== String(data.clienteId)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "El equipo seleccionado no pertenece al cliente indicado."
    });
  }

  const nueva = {
    id: reparaciones.length
      ? Math.max(...reparaciones.map((item) => Number(item.id) || 0)) + 1
      : 1,
    ...data,
    clienteId: Number(data.clienteId),
    equipoId: Number(data.equipoId),
    clienteNombre: `${cliente.nombre} ${cliente.apellido}`,
    equipoDescripcion: `${equipo.tipo} ${equipo.marca} ${equipo.modelo}`,
    createdAt: new Date().toISOString()
  };

  reparaciones.push(nueva);
  return respuesta(res, 201, nueva, "Orden de reparación creada correctamente.");
});

// Actualizar una orden.
router.put("/:id", (req, res) => {
  const reparacion = reparaciones.find(
    (item) => String(item.id) === req.params.id
  );

  if (!reparacion) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "No se encontró la orden de reparación."
    });
  }

  const data = req.body || {};
  const faltantes = validar(data);

  if (faltantes.length) {
    return res.status(400).json({
      success: false,
      data: null,
      message: `Campos obligatorios: ${faltantes.join(", ")}.`
    });
  }

  const cliente = clientes.find(
    (item) => String(item.id) === String(data.clienteId)
  );
  const equipo = equipos.find(
    (item) => String(item.id) === String(data.equipoId)
  );

  if (!cliente || !equipo || String(equipo.clienteId) !== String(data.clienteId)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Verificá que el equipo pertenezca al cliente seleccionado."
    });
  }

  Object.assign(reparacion, data, {
    clienteId: Number(data.clienteId),
    equipoId: Number(data.equipoId),
    clienteNombre: `${cliente.nombre} ${cliente.apellido}`,
    equipoDescripcion: `${equipo.tipo} ${equipo.marca} ${equipo.modelo}`,
    updatedAt: new Date().toISOString()
  });

  return respuesta(res, 200, reparacion, "Orden actualizada correctamente.");
});

// Eliminar una orden.
router.delete("/:id", (req, res) => {
  const indice = reparaciones.findIndex(
    (item) => String(item.id) === req.params.id
  );

  if (indice === -1) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "No se encontró la orden de reparación."
    });
  }

  const eliminada = reparaciones.splice(indice, 1)[0];
  return respuesta(res, 200, eliminada, "Orden eliminada correctamente.");
});

export default router;
