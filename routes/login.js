var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require("../config/config").SEED;

var app = express();
var Usuario = require('../models/usuario');


// Google
var CLIENT_ID = require("../config/config").CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);

const GOOGLE_CLIENT_ID = require("../config/config").GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require("../config/config").GOOGLE_SECRET;

// ==========================================
//  Autenticación De Google
// ==========================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    // const userid = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post("/google", async (req, res) => {
  var token = req.body.token || "XXX";

    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no valido'
            });
        })
    
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        // Si fue creado por google
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Debe de usar su autenticacion normal",
                    errors: err
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, {
                    expiresIn: 14400
                }); // 4 horas

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            }
        } else {
            // El usuario no existe... hay que crearlo

            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                
                var token = jwt.sign({ usuario: usuarioDB }, SEED, {expiresIn: 14400}); // 4 horas
                
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            });
        }
    });
    
    // return res.status(200).json({
    //     ok: true,
    //     mensaje: 'OK!!!',
    //     googleUser: googleUser
    // })
});


// ==========================================
//  Autenticación normal
// ==========================================

app.post('/', (req, res) => {

    var body = req.body;
    console.log(body);

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            // Nunca identificar cual es el dato que esta mal ingresado ni el password ni el email
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        // Crear un token!!!
        usuarioDB.password = ':)';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    })


});





module.exports = app;