const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
require('dotenv').config('./.env')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api', (req, res) => {
    res.send('Api')
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);