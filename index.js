const express = require('express')
const { conectarBaseDeDatos } = require('./bd')

// rutas de componentes
// const rutasDeUsuarios = require('./componentes/usuarios/usuario.rutas')
const rutasDeProyectos = require('./componentes/proyectos/rutas')

// body parser
const bodyParser = require('body-parser')

// Inicializamos express
const app = express()
const PUERTO = process.env.PORT || 3000

conectarBaseDeDatos()

app.use(bodyParser.json())

// Agregamos nuestras rutas
app.get('/', function (solicitud, respuesta) {
  respuesta.send('Hola Bit')
})

// usar rutas de los componentes
// app.use('/usuarios', rutasDeUsuarios)
app.use('/proyectos', rutasDeProyectos)

// Opcion #2 para definir las rutas
require('./componentes/usuarios/usuario.rutas')(app);

// rutas para los avatares
app.use('/avatares', express.static('avatares'))

// Encendemos el servidor de express
app.listen(PUERTO, function () {
  console.log(`Escuchando en http://localhost:${PUERTO}`)
})
