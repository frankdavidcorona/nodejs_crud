const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correoElectronico: { type: String, required: true, unique: true },
  contrasenaEncriptada: { type: String, required: true },
  avatar: { type: String, required: false }
})

// https://openbase.io/js/mongoose-unique-validator
usuarioSchema.plugin(uniqueValidator)

const Usuario = mongoose.model('usuarios', usuarioSchema)

module.exports = Usuario
