const express = require("express");

const dream = require("../public/script/dream");

const explorerRouter = express.Router();

// GET para obtener sueños por tags
explorerRouter.get("/dreams", (req, res) => {
  let tags = req.query.tags.split(",");
  tags = tags.map(tag => tag.trim());
  dream.getDreamsByTags(tags, result => {
    // Si hubo un error devuelvo el mensaje
    if (!result.success) {
      res.json(result);
    } else {
      // Sino devuelvo el array de sueños
      res.render("dream-archive", {
        layout: "main",
        user: req.session.currentUser,
        dreams: result.dreams,
        message: result.message
      });
    }
  });
});

// GET para obtener un sueño por id
explorerRouter.get("/dreams/:id", (req, res) => {
  dream.getDreamById(req.params.id, result => {
    // Si hubo un error devuelvo el mensaje
    if (!result.success) {
      res.json(result);
    } else {
      // Sino devuelvo el sueño
      let diffAuthor = "";
      if (req.session.currentUser) {
        diffAuthor = (req.session.currentUser.username === result.dream.author) ? false : true;
      }
      res.render("dream-view", {
        layout: "main",
        user: req.session.currentUser,
        dream: result.dream,
        diffAuthor
      });
    }
  });
});

// GET para ir a la página de búsqueda
explorerRouter.get("/", (req, res) => {
  res.render("search", {
    layout: "main",
    user: req.session.currentUser
  });
});

module.exports = explorerRouter;