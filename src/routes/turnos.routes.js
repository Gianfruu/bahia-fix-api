import { Router } from "express";
import { clientes, equipos, turnos, filterAndPaginate, parsePagination, validateTurno } from "../data/mock-data.js";

const router = Router();
const estadosPermitidos = ["Solicitado", "Confirmado", "Cancelado", "Atendido"];

function validarRelaciones(data) {
  const cliente = clientes.find((item) => String(item.id) === String(data.clienteId));
  if (!cliente) return "Seleccioná un cliente existente.";
  const equipo = equipos.find((item) => String(item.id) === String(data.equipoId));
  if (!equipo) return "Seleccioná un equipo existente.";
  if (String(equipo.clienteId) !== String(cliente.id)) return "El equipo seleccionado no pertenece al cliente indicado.";
  return null;
}

function validarEstado(estado) {
  return estadosPermitidos.includes(estado);
}

router.get("/", (req, res) => {
  const { page, limit } = parsePagination(req.query);
  return res.status(200).json({
    success: true,
    data: filterAndPaginate(turnos, req.query.q, page, limit),
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
  if (!validarEstado(data.estado)) return res.status(400).json({ success: false, data: null, message: "El estado del turno no es válido." });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.fecha) || Number.isNaN(Date.parse(`${data.fecha}T${data.hora || "00:00"}:00`))) return res.status(400).json({ success: false, data: null, message: "Ingresá una fecha válida." });
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.hora)) return res.status(400).json({ success: false, data: null, message: "Ingresá un horario válido." });
  const turno = {
    id: Math.max(200, ...turnos.map((item) => item.id)) + 1,
    clienteId: Number(data.clienteId),
    equipoId: Number(data.equipoId),
    fecha: data.fecha,
    hora: data.hora,
    motivo: data.motivo.trim(),
    procedencia: data.procedencia.trim(),
    estado: data.estado
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
  if (!validarEstado(data.estado)) return res.status(400).json({ success: false, data: null, message: "El estado del turno no es válido." });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.fecha) || Number.isNaN(Date.parse(`${data.fecha}T${data.hora || "00:00"}:00`))) return res.status(400).json({ success: false, data: null, message: "Ingresá una fecha válida." });
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.hora)) return res.status(400).json({ success: false, data: null, message: "Ingresá un horario válido." });
  Object.assign(turno, {
    clienteId: Number(data.clienteId), equipoId: Number(data.equipoId), fecha: data.fecha,
    hora: data.hora, motivo: data.motivo.trim(), procedencia: data.procedencia.trim(), estado: data.estado
  });
  return res.status(200).json({ success: true, data: turno, message: "Turno actualizado correctamente." });
});

router.delete("/:id", (req, res) => {
  const index = turnos.findIndex((item) => String(item.id) === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, data: null, message: "No se encontró el turno solicitado." });
  const [deleted] = turnos.splice(index, 1);
  return res.status(200).json({ success: true, data: deleted, message: "Turno eliminado correctamente." });
});

export default router;
