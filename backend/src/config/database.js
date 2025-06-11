const { Pool } = require('pg');
require('dotenv').config(); 
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10), 
});

pool.on('connect', () => {
  console.log('Base de dados conectada com sucesso!');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no cliente de banco de dados ocioso', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool 
};