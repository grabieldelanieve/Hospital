var Express = require("express");
var mongoose = require("mongoose");
var app = Express();
var PORT = 3000;

mongoose.connection.openUri(
  "mongodb://localhost:27017/hospitalDB",
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

app.listen(PORT, () => {
  console.log("Server ON!! - port:", PORT);
  console.log();
});