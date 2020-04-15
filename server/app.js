// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');


// Inicializar variables
var app = express();

// CORS
app = require('../validators/Cors');

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


mongoose = require('../models/connectionDB');

// Rutas
app = require('../routes/index');


app.listen(3000, () => {
  console.log("Server ON!! - port:", 3000);
});