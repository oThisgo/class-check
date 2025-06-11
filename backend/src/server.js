require('dotenv').config();
console.log('--- [SERVER.JS] SCRIPT INICIADO ---'); 
const app = require('./app');
const config = require('./config'); 
const db = require('./config/database'); 

const PORT = config.port;

db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar ao PostgreSQL ao iniciar:', err.stack);
    process.exit(1); 
  } else {
    console.log('Conexão com PostgreSQL estabelecida, NOW():', res.rows[0].now);

    app.listen(PORT, () => {
      console.log(`Servidor ${config.nodeEnv} rodando na porta ${PORT}`);
      console.log(`API disponível em http://localhost:${PORT}/api`);
      console.log(`Health check em http://localhost:${PORT}/health`);
    });
  }
});