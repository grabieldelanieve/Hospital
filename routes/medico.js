var express = require("express");


var app = express();

var Medico = require("../models/medico");
var mdAutenticacion = require("../middlewares/autenticacion");

// ==========================================
// Obtener todos los hospital
// ==========================================

app.get("/", (req, res) => {
  Medico.find({})
    .populate("usuario", "nombre email")
    .populate("hospital", "nombre email")
    .exec((err, medico) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error cargando medico",
          errors: err
        });
      }

      res.json({
        ok: true,
        medico: medico
      });
    });
});


app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al buscar medico",
        errors: err
      });
    }

    if (!medico) {
      return res.status(400).json({
        ok: false,
        message: "El medico con el id " + id + "no existe",
        errors: { message: "No existe un medico con ese ID" }
      });
    }

    medico.nombre = body.nombre;
    medico.usuario = req.usuario._id;
    medico.hospital = body.hospital._id;

    Medico.save((err, medicoGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar medico",
          errors: err
        });
      }


      res.status(200).json({
        ok: true,
        medico: medicoGuardado
      });
    });
  });
});

// ==========================================
// Crear un nuevo hospital
// ==========================================
app.post("/", mdAutenticacion.verificaToken, (req, res) => {
  var body = req.body;

  var medico = new Medico({
    nombre: body.nombre,
    usuario: req.usuario,
    hospital: body.hospital
  });

  medico.save((err, medicoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear medico",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      medico: medicoGuardado
    });
  });
});

// ============================================
//   Borrar un usuario por el id
// ============================================
app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error borrar medico",
        errors: err
      });
    }

    if (!medicoBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un medico con ese id",
        errors: { message: "No existe un medico con ese id" }
      });
    }

    res.status(200).json({
      ok: true,
      medico: medicoBorrado
    });
  });
});

module.exports = app;
