// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var loginRoutes = require('./routes/login');
var searchRoutes = require('./routes/search');
var uploadRoutes = require("./routes/upload");
var imagesnesRoutes = require('./routes/images');

mongoose.connection.openUri(
  "mongodb://localhost:27017/hospitalDB",
  { useNewUrlParser: true },
  
  (err, res) => {
      if (err) throw err;
      console.log("Base de datos: \x1b[32m%s\x1b[0m", "online");
  }
);

app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Peticion realizada correctamente"
  });
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', searchRoutes);
app.use("/upload", uploadRoutes);
app.use('/img', imagesnesRoutes);
app.use('/', appRoutes);


app.listen(3000, () => {
  console.log("Server ON!! - port:", 3000);
  console.log();
});