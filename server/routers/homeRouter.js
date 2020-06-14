const express = require("express");
const dream = require("../public/script/dream");

const homeRouter = express.Router();

// GET a Home
homeRouter.get("/", (req, res) => {
  // 1- Si hay no una sesión iniciada redirecciona a landing
  if (!req.session.currentUser) {
    res.redirect("/");
  } else {
    // 2- Si hay una sesión activa renderiza home
    res.render("home", {
      layout: "main",
      user: req.session.currentUser,
      message: req.session.message
    });
  }
});

// POST para crear un nuevo sueño
homeRouter.post("/new-dream", (req, res) => {
  // 1- Si hay no una sesión iniciada redirecciona a landing
  if (!req.session.currentUser) {
    res.redirect("/");
  } else {
    // 2- Si hay una sesión activa, agrega el sueño a la colección dreams
    dream.createDream(req.body, result => {
      // Si hubo un error devuelvo el mensaje
      if (!result.success) {
        res.json(result);
      } else {
        // Si salió bien, devuelvo el OK
        req.session.message = result.message;
        res.redirect("/home");
      }
    });
  }
});

// GET para obtener los sueños por autor
homeRouter.get("/dreams", (req, res) =>{
  dream.getDreamByAuthor(req.query.author, result => {
    // Si hubo un error devuelvo el mensaje
    if (!result.success) {
      res.json(result);
    } else {
      res.json(result.dream);
    }
  });
});

module.exports = homeRouter;