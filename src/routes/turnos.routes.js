import { Router } from "express";
import {
  clientes,
  equipos,
  turnos,
  parsePagination,
  validateTurno,
  sortRecords
} from "../data/mock-data.js";

const router = Router();
const estadosPermitidos = ["Solicitado", "Confirmado", "Cancelado", "Atendido"];

function validarRelaciones(data) {
  const cliente = clientes.find((item) => String(item.id) === String(data.clienteId));
  if (!cliente) return "Seleccioná un cliente existente.";
  const equipo = equipos.find((item) => String(item.id) === String(data.equipoId));
  if (!equipo) return "Seleccioná un equipo existente.";
  if (String(equipo.clienteId) !== String(cliente.id)) {
    return "El equipo seleccionado no pertenece al cliente indicado.";
  }
  return null;
}

function validarFechaHora(data) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.fecha)) return "Ingresá una fecha válida.";
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.hora)) return "Ingresá un horario válido.";
  const parts = data.fecha.split("-").map(Number);
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  if (date.getUTCFullYear() !== parts[0] || date.getUTCMonth() !== parts[1] - 1 || date.getUTCDate() !== parts[2]) {
    return "Ingresá una fecha válida.";
  }
  return null;
}

function validarConflicto(data, excludeId = null) {
  if (data.estado === "Cancelado") return null;
  const conflict = turnos.find((item) =>
    String(item.id) !== String(excludeId) &&
    item.fecha === data.fecha &&
    item.hora === data.hora &&
    item.estado !== "Cancelado"
  );
  return conflict ? "Ya existe un turno activo en esa fecha y horario." : null;
}

function filtrarTurnos(query) {
  let result = [...turnos];
  if (query.fecha) result = result.filter((item) => item.fecha === query.fecha);
  if (query.estado) result = result.filter((item) => item.estado === query.estado);
  if (query.clienteId) result = result.filter((item) => String(item.clienteId) === String(query.clienteId));
  const term = String(query.q || "").trim().toLocaleLowerCase("es");
  if (term) {
    result = result.filter((item) => {
      const cliente = clientes.find((person) => person.id === item.clienteId);
      const equipo = equipos.find((tool) => tool.id === item.equipoId);
      const text = [
        item.id, item.fecha, item.hora, item.motivo, item.procedencia, item.estado,
        cliente?.nombre, cliente?.apellido, equipo?.tipo, equipo?.marca, equipo?.modelo
      ].join(" ").toLocaleLowerCase("es");
      return text.includes(term);
    });
  }
  const sorted = sortRecords(result, query.sortBy || "fecha", query.order || "asc");
  return sorted;
}

router.get("/resumen", (req, res) => {
  const summary = {
    total: turnos.length,
    solicitados: turnos.filter((item) => item.estado === "Solicitado").length,
    confirmados: turnos.filter((item) => item.estado === "Confirmado").length,
    atendidos: turnos.filter((item) => item.estado === "Atendido").length,
    cancelados: turnos.filter((item) => item.estado === "Cancelado").length
  };
  return res.status(200).json({ success: true, data: summary, message: "Resumen de turnos obtenido correctamente." });
});

router.get("/", (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const filtered = filtrarTurnos(req.query);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  return res.status(200).json({
    success: true,
    data: { items: filtered.slice(start, start + limit), total, page: currentPage, limit, totalPages },
    message: "Listado de turnos obtenido correctamente."
  });
});

router.get("/:id", (req, res) => {
  const turno = turnos.find((item) => String(item.id) === req.params.id);
  if (!turno) return res.status(404).json({ success: false, data: null, message: "No se encontró el turno solicitado." });
  return res.status(200).json({ success: true, data: turno, message: "Turno obtenido correctamente." });
});

router.post("/", (req, res) => {
  const data = req.body || {};
  const missing = validateTurno(data);
  if (missing.length) return res.status(400).json({ success: false, data: null, message: `Campos obligatorios: ${missing.join(", ")}.` });
  const relationError = validarRelaciones(data);
  if (relationError) return res.status(400).json({ success: false, data: null, message: relationError });
  if (!estadosPermitidos.includes(data.estado)) return res.status(400).json({ success: false, data: null, message: "El estado del turno no es válido." });
  const dateError = validarFechaHora(data);
  if (dateError) return res.status(400).json({ success: false, data: null, message: dateError });
  const conflictError = validarConflicto(data);
  if (conflictError) return res.status(409).json({ success: false, data: null, message: conflictError });

  const turno = {
    id: Math.max(200, ...turnos.map((item) => item.id)) + 1,
    clienteId: Number(data.clienteId), equipoId: Number(data.equipoId),
    fecha: data.fecha, hora: data.hora, motivo: data.motivo.trim(),
    procedencia: data.procedencia.trim(), estado: data.estado
  };
  turnos.push(turno);
  return res.status(201).json({ success: true, data: turno, message: "Turno registrado correctamente." });
});

router.put("/:id", (req, res) => {
  const turno = turnos.find((item) => String(item.id) === req.params.id);
  if (!turno) return res.status(404).json({ success: false, data: null, message: "No se encontró el turno solicitado." });
  const data = req.body || {};
  const missing = validateTurno(data);
  if (missing.length) return res.status(400).json({ success: false, data: null, message: `Campos obligatorios: ${missing.join(", ")}.` });
  const relationError = validarRelaciones(data);
  if (relationError) return res.status(400).json({ success: false, data: null, message: relationError });
  if (!estadosPermitidos.includes(data.estado)) return res.status(400).json({ success: false, data: null, message: "El estado del turno no es válido." });
  const dateError = validarFechaHora(data);
  if (dateError) return res.status(400).json({ success: false, data: null, message: dateError });
  const conflictError = validarConflicto(data, turno.id);
  if (conflictError) return res.status(409).json({ success: false, data: null, message: conflictError });

  Object.assign(turno, {
    clienteId: Number(data.clienteId), equipoId: Number(data.equipoId),
    fecha: data.fecha, hora: data.hora, motivo: data.motivo.trim(),
    procedencia: data.procedencia.trim(), estado: data.estado
  });
  return res.status(200).json({ success: true, data: turno, message: "Turno actualizado correctamente." });
});

router.patch("/:id/estado", (req, res) => {
  const turno = turnos.find((item) => String(item.id) === req.params.id);
  if (!turno) return res.status(404).json({ success: false, data: null, message: "No se encontró el turno solicitado." });
  const { estado } = req.body || {};
  if (!estadosPermitidos.includes(estado)) return res.status(400).json({ success: false, data: null, message: "El estado indicado no es válido." });
  turno.estado = estado;
  return res.status(200).json({ success: true, data: turno, message: "Estado actualizado correctamente." });
});

router.delete("/:id", (req, res) => {
  const index = turnos.findIndex((item) => String(item.id) === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, data: null, message: "No se encontró el turno solicitado." });
  const [deleted] = turnos.splice(index, 1);
  return res.status(200).json({ success: true, data: deleted, message: "Turno eliminado correctamente." });
});

export default router;
