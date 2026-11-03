export const clientes = [
  { id: 1, nombre: "Martín", apellido: "Gómez", telefono: "291 455-1020", email: "martin.gomez@example.com", localidad: "Bahía Blanca" },
  { id: 2, nombre: "Lucía", apellido: "Fernández", telefono: "291 488-7641", email: "lucia.fernandez@example.com", localidad: "Punta Alta" },
  { id: 3, nombre: "Carlos", apellido: "Pérez", telefono: "291 433-9022", email: "carlos.perez@example.com", localidad: "Bahía Blanca" },
  { id: 4, nombre: "Sofía", apellido: "Ramírez", telefono: "2921 41-7788", email: "sofia.ramirez@example.com", localidad: "Tornquist" },
  { id: 5, nombre: "Diego", apellido: "López", telefono: "291 501-6630", email: "diego.lopez@example.com", localidad: "Bahía Blanca" }
];

export const equipos = [
  { id: 101, clienteId: 1, tipo: "Taladro", marca: "Bosch", modelo: "GSB 13 RE", numeroSerie: "BSH-013-4821", estado: "En revisión", garantia: "A verificar" },
  { id: 102, clienteId: 2, tipo: "Motosierra", marca: "Stihl", modelo: "MS 170", numeroSerie: "STH-170-2230", estado: "Ingresado", garantia: "Fuera de garantía" },
  { id: 103, clienteId: 3, tipo: "Amoladora", marca: "DeWalt", modelo: "DWE402", numeroSerie: "DWT-402-9844", estado: "Listo para retirar", garantia: "En garantía" },
  { id: 104, clienteId: 1, tipo: "Generador", marca: "Honda", modelo: "EG 2500", numeroSerie: "HND-2500-1108", estado: "En reparación", garantia: "Fuera de garantía" },
  { id: 105, clienteId: 5, tipo: "Desmalezadora", marca: "Echo", modelo: "SRM-22", numeroSerie: "ECH-022-7401", estado: "Ingresado", garantia: "A verificar" }
];

export function filterAndPaginate(records, query, page, limit) {
  const normalizedQuery = String(query || "").trim().toLocaleLowerCase("es");
  const filtered = records.filter((record) => Object.values(record).some((value) => String(value).toLocaleLowerCase("es").includes(normalizedQuery))).sort((a, b) => a.id - b.id);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  return { items: filtered.slice(start, start + limit), total, page: currentPage, limit, totalPages };
}

export function parsePagination(query) {
  const requestedPage = Number.parseInt(query.page, 10);
  const requestedLimit = Number.parseInt(query.limit, 10);
  return {
    page: Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    limit: Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 100) : 10
  };
}

export function validateCliente(data) {
  const required = ["nombre", "apellido", "telefono", "email", "localidad"];
  return required.filter((field) => typeof data[field] !== "string" || !data[field].trim());
}

export function validateEquipo(data) {
  const required = ["clienteId", "tipo", "marca", "modelo", "numeroSerie", "estado", "garantia"];
  return required.filter((field) => data[field] === undefined || data[field] === null || String(data[field]).trim() === "");
}


export const turnos = [
  { id: 201, clienteId: 1, equipoId: 101, fecha: "2026-11-04", hora: "09:00", motivo: "Revisión general", procedencia: "Presencial", estado: "Solicitado" },
  { id: 202, clienteId: 2, equipoId: 102, fecha: "2026-11-05", hora: "10:30", motivo: "Mantenimiento", procedencia: "Localidad vecina", estado: "Confirmado" },
  { id: 203, clienteId: 3, equipoId: 103, fecha: "2026-11-06", hora: "14:00", motivo: "Evaluación de falla", procedencia: "Presencial", estado: "Solicitado" }
];

export function validateTurno(data) {
  const required = ["clienteId", "equipoId", "fecha", "hora", "motivo", "procedencia", "estado"];
  return required.filter((field) => data[field] === undefined || data[field] === null || String(data[field]).trim() === "");
}

export const reparaciones = [
  {
    id: 301,
    clienteId: 1,
    equipoId: 101,
    fechaIngreso: "2026-10-20",
    motivo: "El taladro presenta pérdida de potencia.",
    estado: "Terminado",
    observaciones: "Se realizó una revisión general y mantenimiento.",
    clienteNombre: "Martín Gómez",
    equipoDescripcion: "Taladro Bosch GSB 13 RE",
    createdAt: "2026-10-20T09:00:00.000Z"
  },
  {
    id: 302,
    clienteId: 2,
    equipoId: 102,
    fechaIngreso: "2026-10-25",
    motivo: "La motosierra no arranca correctamente.",
    estado: "En diagnóstico",
    observaciones: "Pendiente de evaluación técnica.",
    clienteNombre: "Lucía Fernández",
    equipoDescripcion: "Motosierra Stihl MS 170",
    createdAt: "2026-10-25T10:30:00.000Z"
  },
  {
    id: 303,
    clienteId: 3,
    equipoId: 103,
    fechaIngreso: "2026-10-27",
    motivo: "La amoladora presenta vibraciones.",
    estado: "Presupuestado",
    observaciones: "Se detectó desgaste y se preparó un presupuesto.",
    clienteNombre: "Carlos Pérez",
    equipoDescripcion: "Amoladora DeWalt DWE402",
    createdAt: "2026-10-27T14:00:00.000Z"
  },
  {
    id: 304,
    clienteId: 1,
    equipoId: 104,
    fechaIngreso: "2026-10-29",
    motivo: "El generador no mantiene el funcionamiento.",
    estado: "En reparación",
    observaciones: "Reparación en curso.",
    clienteNombre: "Martín Gómez",
    equipoDescripcion: "Generador Honda EG 2500",
    createdAt: "2026-10-29T11:15:00.000Z"
  },
  {
    id: 305,
    clienteId: 5,
    equipoId: 105,
    fechaIngreso: "2026-11-01",
    motivo: "Mantenimiento general de desmalezadora.",
    estado: "Recibido",
    observaciones: "Equipo ingresado para revisión.",
    clienteNombre: "Diego López",
    equipoDescripcion: "Desmalezadora Echo SRM-22",
    createdAt: "2026-11-01T08:45:00.000Z"
  }
];

