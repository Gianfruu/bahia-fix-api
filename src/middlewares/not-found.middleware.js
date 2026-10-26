function notFoundMiddleware(req, res) {
  res.status(404).json({
    success: false,
    data: null,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
}

export default notFoundMiddleware;
