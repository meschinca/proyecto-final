const express = require("express");
const dream = require("../public/script/dream");

const homeRouter = express.Router();

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
homeRouter.get("/dreams", (req, res) => {
  dream.getDreamByAuthor(req.query.author, result => {
    const user = req.session.currentUser;
    // Si hubo un error devuelvo el mensaje
    if (!result.success) {
      res.json(result);
    } else {
      // Si el que lo solicita no es el autor o no se encuentra "logueado"
      if ((!user)||(user.username != req.query.author)) {
        // Filtramos los sueños por visibilidad pública
        dreams = result.dreams.filter(dream => { return dream.visibility == "on" });
        res.render("dream-archive", {
          layout: "main",
          user: user,
          dreams: dreams
        });
      } else {
        // Si lo solicita el autor
        res.render("dream-archive", {
          layout: "main",
          user: user,
          dreams: result.dreams
        });
      }
    }
  });
});

// POST para agrgar un comentario
homeRouter.post("/add-comment", (req, res) => {
  dream.addComment(req.body.comment, req.body.id, req.body.author, result => {
    // Si hubo un error devuelvo el mensaje
    if (!result.success) {
      res.json(result);
    } else {
      res.redirect(`/explore/dreams/${req.body.id}`);
    }
  });
});

// Get a Profile
homeRouter.get("/profile", (req, res) => {
  const user = req.session.currentUser;
  res.render("profile", {
    layout: "main",
    user: user
  });
});

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

module.exports = homeRouter;