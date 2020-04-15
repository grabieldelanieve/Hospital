// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');


// Inicializar variables
var app = express();

// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
  next();
});


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


mongoose.connection.openUri(
  "mongodb://localhost:27017/hospitalDB",
  { useNewUrlParser: true },
  
  (err, res) => {
      if (err) throw err;
      console.log("Base de datos: \x1b[32m%s\x1b[0m", "online");
  }
);

// app = require('../routes/index');

// Importar rutas
var appRoutes = require('../routes/app');
var usuarioRoutes = require('../routes/usuario');
var hospitalRoutes = require('../routes/hospital');
var medicoRoutes = require('../routes/medico');
var loginRoutes = require('../routes/login');
var searchRoutes = require('../routes/search');
var uploadRoutes = require("../routes/upload");
var imagesnesRoutes = require('../routes/images');


// Rutas
app.use("/usuario", usuarioRoutes);
app.use("/login", loginRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/medico", medicoRoutes);
app.use("/busqueda", searchRoutes);
app.use("/upload", uploadRoutes);
app.use("/img", imagesnesRoutes);
app.use("/", appRoutes);


app.listen(3000, () => {
  console.log("Server ON!! - port:", 3000);
  console.log();
});