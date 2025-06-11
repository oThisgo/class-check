const errorMiddleware = (error, req, res, next) => {
  console.error('Erro:', error.stack || error.message || error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Ocorreu um erro interno no servidor.';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,

  });
};

module.exports = { errorMiddleware };