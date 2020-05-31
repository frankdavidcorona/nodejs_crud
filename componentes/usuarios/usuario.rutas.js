module.exports = (app) => {
    const usuario = require('./usuario.controlador');
    const multer = require('multer')
    const subidaDeArchivos = multer({ dest: 'avatares/' })

    // Inicio de sesion del usuario
    app.post('/usuario/login', usuario.login);

    // Crear un nuevo Usuario
    app.post('/usuario', subidaDeArchivos.single('avatar'), usuario.create);

    // Obtener todos los usuarios
    app.get('/usuario', usuario.findAll);

    // Obtener un solo Usuario con el usuarioId
    app.get('/usuario/:usuarioId', usuario.findOne);

    // Actualizar un Usuario con el usuarioId
    app.put('/usuario/:usuarioId', usuario.update);

    // Eliminar un Usuario con el usuarioId
    app.delete('/usuario/:usuarioId', usuario.delete);
}