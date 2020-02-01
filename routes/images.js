var Express = require('express');
var fs = require('fs');
var path = require('path');

var app = Express();



app.get('/:tipo/:img', (req, res ) => {
    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImages = path.resolve( __dirname,`../uploads/${tipo}/${img}`);


    if (fs.existsSync(pathImages)) {
        res.sendFile(pathImages);
    } else {
        var pathNoImagen = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImagen);
    }
});


module.exports = app;