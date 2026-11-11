import { Router } from "express";
import {
  clientes,
  equipos,
  reparaciones,
  filterAndPaginate,
  parsePagination
} from "../data/mock-data.js";

const router = Router();

const estadosValidos = [
  "Recibido",
  "En diagnóstico",
  "Presupuestado",
  "Aprobado",
  "En reparación",
  "Terminado",
  "Entregado"
];

const garantiasValidas = ["A verificar", "En garantía", "Fuera de garantía"];

function validar(data) {
  const errores = [];
  const obligatorios = ["clienteId", "equipoId", "fechaIngreso", "motivo", "estado"];

  obligatorios.forEach((campo) => {
    if (data[campo] === undefined || data[campo] === null || String(data[campo]).trim() === "") {
      errores.push(`El campo ${campo} es obligatorio.`);
    }
  });

  ["clienteId", "equipoId"].forEach((campo) => {
    if (data[campo] !== undefined && (!Number.isInteger(Number(data[campo])) || Number(data[campo]) <= 0)) {
      errores.push(`El campo ${campo} debe ser un identificador válido.`);
    }
  });

  if (data.fechaIngreso && !/^\d{4}-\d{2}-\d{2}$/.test(data.fechaIngreso)) {
    errores.push("La fecha de ingreso debe tener el formato AAAA-MM-DD.");
  } else if (data.fechaIngreso) {
    const fecha = new Date(`${data.fechaIngreso}T00:00:00`);
    if (Number.isNaN(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== data.fechaIngreso) {
      errores.push("La fecha de ingreso no es válida.");
    }
  }

  if (data.motivo !== undefined && (typeof data.motivo !== "string" || !data.motivo.trim())) {
    errores.push("El motivo debe ser un texto válido.");
  }

  if (data.estado && !estadosValidos.includes(data.estado)) {
    errores.push("El estado de la reparación no es válido.");
  }

  if (data.garantia !== undefined && !garantiasValidas.includes(data.garantia)) {
    errores.push("La garantía indicada no es válida.");
  }

  const manoObra = data.manoObra === undefined ? 0 : Number(data.manoObra);
  if (!Number.isFinite(manoObra) || manoObra < 0) {
    errores.push("La mano de obra debe ser un importe igual o mayor a cero.");
  }

  if (data.repuestos !== undefined && !Array.isArray(data.repuestos)) {
    errores.push("Los repuestos deben enviarse como una lista.");
  } else if (Array.isArray(data.repuestos)) {
    data.repuestos.forEach((item, index) => {
      const cantidad = Number(item?.cantidad);
      const precio = Number(item?.precio);
      if (!item || typeof item.descripcion !== "string" || !item.descripcion.trim()) {
        errores.push(`El repuesto ${index + 1} debe tener una descripción.`);
      }
      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        errores.push(`La cantidad del repuesto ${index + 1} debe ser un entero mayor a cero.`);
      }
      if (!Number.isFinite(precio) || precio < 0) {
        errores.push(`El precio del repuesto ${index + 1} debe ser igual o mayor a cero.`);
      }
    });
  }

  return errores;
}

function normalizarImportes(data) {
  const manoObra = Number(data.manoObra ?? 0);
  const repuestos = (data.repuestos || []).map((item) => ({
    descripcion: item.descripcion.trim(),
    cantidad: Number(item.cantidad),
    precio: Number(item.precio)
  }));
  const totalRepuestos = repuestos.reduce(
    (total, item) => total + item.cantidad * item.precio,
    0
  );

  return {
    ...data,
    manoObra,
    repuestos,
    total: manoObra + totalRepuestos
  };
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
    limit,
    req.query.sortBy,
    req.query.order
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
      message: faltantes.join(" ")
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

  const datosNormalizados = normalizarImportes(data);
  const nueva = {
    id: reparaciones.length
      ? Math.max(...reparaciones.map((item) => Number(item.id) || 0)) + 1
      : 1,
    ...datosNormalizados,
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
      message: faltantes.join(" ")
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

  const datosNormalizados = normalizarImportes(data);
  Object.assign(reparacion, datosNormalizados, {
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
