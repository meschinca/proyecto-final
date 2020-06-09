// Fijamos el puerto
const port = 5678;
// Traemos los módulos
const express = require("express");
const path = require("path");
const expHbs = require("express-handlebars");
const bodyParser = require("body-parser");

// Inicialización
const app = express();

//Configuramos el motor de vistas
app.set("view engine", "handlebars");

app.engine("handlebars", expHbs({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layout")
}));

app.set("views", path.join(__dirname, "views"));

// Ruta estática a recursos
app.use(express.static(path.join(__dirname, "public")));

// Body parser para tipo de contenido "aplication/x-www-form-urlencoded"
app.use(bodyParser.urlencoded({ extended: true }));

// GET a página landing
app.get("/", (req, res)=>{
  res.sendFile(path.join(__dirname, "../client/landing.html"));
})

// Inicio del servidor
app.listen(port, ()=>{
  console.log("Servidor iniciado en puerto 5678: http://localhost:5678");
})