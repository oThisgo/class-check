const express = require('express');
console.log('--- [APP.JS] SCRIPT INICIADO ---'); 
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes'); 
const { errorMiddleware } = require('./middleware/errorMiddleware');
const config = require('./config');



const app = express();

const corsOptions = {
  origin: '*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`[LOG GLOBAL APP.JS] Requisição recebida: ${req.method} ${req.originalUrl}`);
    console.log('[LOG GLOBAL APP.JS] Headers:', JSON.stringify(req.headers, null, 2));
    next();
});


app.use('/api', apiRoutes);

app.get('/health', (req, res) => res.status(200).send('API está saudável!'));

app.use(errorMiddleware);

module.exports = app;