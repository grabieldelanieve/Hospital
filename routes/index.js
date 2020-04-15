const express = require("express");
const app = express();

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


module.exports = app;
