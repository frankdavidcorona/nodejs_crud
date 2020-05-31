const express = require('express')
const router = express.Router()
const Usuario = require('./usuario.modelo')
const { responder } = require('../../utilidades/funciones')
const bcrypt = require('bcryptjs')
const { crearToken, middlewareDeAutorizacion } = require('../../utilidades/autenticacion')

const multer = require('multer')
const subidaDeArchivos = multer({ dest: 'avatares/' })

router.get('/', middlewareDeAutorizacion, function (solicitud, respuesta) {
  // El segundo parametro solo es necesario cuando yo necesito traer unos campos especificos, es decir, no todos
  // Para traer Todos los campos Usuario.find(solicitud.query, function(error, usuarios) {
  // Para traer solo el campo "nombre" Usuario.find(solicitud.query, ['nombre'], function(error, usuarios) {
  Usuario.find(solicitud.query, ['nombre', 'correoElectronico', 'avatar'], function (error, usuarios) {
    responder(error, respuesta, usuarios)
  })
})

router.post('/', subidaDeArchivos.single('avatar'), function (solicitud, respuesta) {
  const datosUsuario = {
    avatar: `${solicitud.protocol}://${solicitud.get('host')}/${solicitud.file.destination}${solicitud.file.filename}`,
    nombre: solicitud.body.nombre,
    correoElectronico: solicitud.body.correoElectronico,
    contrasenaEncriptada: solicitud.body.contrasena === undefined ? null : bcrypt.hashSync(solicitud.body.contrasena)
  }

  const nuevoUsuario = new Usuario(datosUsuario)
  nuevoUsuario.save(function (error, usuarioCreado) {
    responder(error, respuesta, usuarioCreado)
  })
})

router.post('/inicio_de_sesion', function (solicitud, respuesta) {
  Usuario.findOne({ correoElectronico: solicitud.body.correoElectronico }, function (error, usuario) {
    const mensajeEnCasoDeError = 'Ni el correo, ni la contraseña coinciden'

    if (error || !bcrypt.compareSync(solicitud.body.contrasena, usuario.contrasenaEncriptada)) {
      responder(error, respuesta, null, mensajeEnCasoDeError, 401)
    } else {
      responder(error, respuesta, { jwt: crearToken(usuario) })
    }
  })

})

module.exports = router
