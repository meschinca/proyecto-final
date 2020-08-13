const express = require("express");

const dream = require("../public/script/dream");

const explorerRouter = express.Router();

// GET para obtener sueños por tags
explorerRouter.get("/dreams", (req, res) => {
  const user = req.session.currentUser;
  let tags = req.query.tags.split(",");
  tags = tags.map(tag => tag.trim());
  dream.getDreamsByTags(tags, result => {
    // Si hubo un error devuelvo el mensaje
    if (!result.success) {
      res.json(result);
    } else {
      // Sino devuelvo el array de sueños con visibilidad pública
      result.dreams = result.dreams.filter(dream => { return dream.visibility == "on" });
      res.render("dream-archive", {
        layout: "main",
        user: user,
        dreams: result.dreams,
        message: result.message
      });
    }
  });
});

// GET para obtener un sueño por id
explorerRouter.get("/dreams/:id", (req, res) => {
  const user = req.session.currentUser;
  dream.getDreamById(req.params.id, result => {
    // Si hubo un error devuelvo el mensaje
    if (!result.success) {
      res.json(result);
    } else {
      // Sino devuelvo el sueño
      res.render("dream-view", {
        layout: "main",
        user: user,
        dream: result.dream,
      });
    }
  });
});

// GET para ir a la página de búsqueda
explorerRouter.get("/", (req, res) => {
  const user = req.session.currentUser;
  res.render("search", {
    layout: "main",
    user: user
  });
});

module.exports = explorerRouter;