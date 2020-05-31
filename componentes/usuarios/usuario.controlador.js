const Usuario = require('./usuario.modelo');
const { responder } = require('../../utilidades/funciones')

exports.login = (req, res) => {
    Usuario.findOne({ correoElectronico: req.body.correoElectronico }, function (error, usuario) {
        const mensajeEnCasoDeError = 'Ni el correo, ni la contraseña coinciden'

        if (error || !bcrypt.compareSync(req.body.contrasena, usuario.contrasenaEncriptada)) {
            responder(error, res, null, mensajeEnCasoDeError, 401)
        } else {
            responder(error, res, { jwt: crearToken(usuario) })
        }
    })
}

// Create and Save a new Usuario
exports.create = (req, res) => {
    // Validate request
    if (!req.body.content) {
        return res.status(400).send({
            message: "El contenido del Usuario no puede estar vacio"
        });
    }

    // Create a Usuario
    const usuario = new Usuario({
        avatar: `${req.protocol}://${req.get('host')}/${req.file.destination}${req.file.filename}`,
        nombre: req.body.nombre,
        correoElectronico: req.body.correoElectronico,
        contrasenaEncriptada: req.body.contrasena === undefined ? null : bcrypt.hashSync(req.body.contrasena)
    });

    // Save Usuario in the database
    usuario.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Ha ocurrido algun error creando el Usuario."
            });
        });
};

// Retrieve and return all usuarios from the database.
exports.findAll = (req, res) => {
    Usuario.find()
        .then(usuarios => {
            res.send(usuarios);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Ha ocurrido algun error obteniendo los usuarios."
            });
        });
};

// Encontrar un usuario con el usuarioId
exports.findOne = (req, res) => {
    Usuario.findById(req.params.usuarioId)
        .then(usuario => {
            if (!usuario) {
                return res.status(404).send({
                    message: "Usuario no encontrado con id " + req.params.usuarioId
                });
            }
            res.send(usuario);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Usuario no encontrado con id " + req.params.usuarioId
                });
            }
            return res.status(500).send({
                message: "Error obteniendo el usuario con id " + req.params.usuarioId
            });
        });
};

// Update a usuario identified by the usuarioId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.content) {
        return res.status(400).send({
            message: "El usuario no puede estar vacio"
        });
    }

    // Encontrar el usuario y actualizarlo con el body del request
    Usuario.findByIdAndUpdate(req.params.usuarioId, {
        avatar: `${req.protocol}://${req.get('host')}/${req.file.destination}${req.file.filename}`,
        nombre: req.body.nombre,
        correoElectronico: req.body.correoElectronico,
        contrasenaEncriptada: req.body.contrasena === undefined ? null : bcrypt.hashSync(req.body.contrasena)
    }, { new: true })
        .then(usuario => {
            if (!usuario) {
                return res.status(404).send({
                    message: "No se ha encontrado un usuario con el id " + req.params.usuarioId
                });
            }
            res.send(usuario);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "No se ha encontrado un usuario con el id " + req.params.usuarioId
                });
            }
            return res.status(500).send({
                message: "Error actualizando el usuario con id " + req.params.usuarioId
            });
        });
};

// Eliminar un usuario con el id especificado en el request
exports.delete = (req, res) => {
    Usuario.findByIdAndRemove(req.params.usuarioId)
        .then(usuario => {
            if (!usuario) {
                return res.status(404).send({
                    message: "Usuario no encontrado con id " + req.params.usuarioId
                });
            }
            res.send({ message: "Usuario eliminado successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Usuario no encontrado con id " + req.params.usuarioId
                });
            }
            return res.status(500).send({
                message: "No se puede eliminar el usuario con id " + req.params.usuarioId
            });
        });
};