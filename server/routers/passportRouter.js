const express = require("express");
const passport = require("../public/script/passport");

const passportRouter = express.Router();

passportRouter.post("/signup", (req, res) => {
  // 1- Verifico que no exista el usuario
  passport.getUser(req.body.username, result => {
    // Si no se pudo conectar con la base de datos
    if (!result.success) {
      res.json(result);
    } else {
      // Si ya se encuentra un usuario registrado con ese nombre
      if (result.user) {
        res.json(result);
      } else {
        // 2- Uso la función para registrar nuevo usuario
        // Sino, agregamos el nuevo usuario a la base de datos
        passport.registerNewUser(req.body.username, req.body.password, result => {
          // 3- Ruteo a Home o devuelvo un error, según corresponda
          // Si no se pudo registrar al usuario en la base de datos
          if (!result.success) {
            res.json(result);
          } else {
            // Sino, confirmamos la creación del usuario y redireccionamos a /home
            res.json(result);//.redirect("/home")
          }
        });
      }
    }
  });
});

// passportRouter.post("/login", (req, res) => {
//   // 1- Verifico que exista el usuario y coincida la contraseña
//   // 2- Ruteo a Home o devuelvo un error, según corresponda
// });

module.exports = passportRouter;