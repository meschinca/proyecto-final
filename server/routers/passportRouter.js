const express = require("express");
const passport = require("../scripts/passport");

const passportRouter = express.Router();

// POST para registrar nuevo usuario
passportRouter.post("/signup", (req, res) => {
  // 1- Verifico que no exista el usuario por nombre o email
  passport.getUserByName(req.body.username, result => {
    // Si no se pudo conectar con la base de datos
    if (!result.success) {
      res.json(result);
    } else {
      // Si ya se encuentra un usuario registrado con ese nombre
      if (result.user) {
        res.json({ success: false, message: "Ya existe un usuario con ese nombre. Intente con otro nombre por favor." });
      } else {
        passport.getUserByEmail(req.body.email, result => {
          // Si no se pudo conectar con la base de datos
          if (!result.success) {
            res.json(result);
          } else {
            // Si ya se encuentra un usuario registrado con ese correo
            if (result.user) {
              res.json({ success: false, message: "Ya existe un usuario con esa dirección de correo. Intente con otro email por favor." });
            } else {
              // 2- Uso la función para registrar nuevo usuario
              passport.registerNewUser(req.body.username, req.body.password, req.body.email, result => {
                // Si no se pudo registrar al usuario en la base de datos
                if (!result.success) {
                  res.json(result);
                } else {
                  // Sino, confirmamos la creación del usuario
                  req.session.currentUser = result.user;
                  res.json(result);
                }
              });
            }
          }
        });
      }
    }
  });
});

// POST para ingresar con cuenta existente
passportRouter.post("/login", (req, res) => {
  // 1- Verifico que exista el usuario y coincida la contraseña
  passport.getUserByName(req.body.username, result => {
    // Si no se pudo conectar con la base de datos
    if (!result.success) {
      res.json(result);
    } else {
      // Si no se encuentra un usuario registrado con ese nombre
      if (!result.user) {
        res.json(result);
      } else {
        // 2- Si existe el usuario
        passport.loginUser(req.body.username, req.body.password, result => {
          if (!result.success) {
            res.json(result);
          } else {
            req.session.currentUser = result.user;
            res.json(result);
          }
        });
      }
    }
  });
});

// GET para cerrar sesión
passportRouter.get("/logout", (req, res) =>{
  req.session.destroy();
  res.redirect("/");
});

module.exports = passportRouter;