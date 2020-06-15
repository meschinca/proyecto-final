const express = require("express");

const dream = require("../public/script/dream");

const explorerRouter = express.Router();

// GET para obtener un sueño por id
explorerRouter.get("/dreams/:id", (req, res) =>{
  dream.getDreamById(req.params.id, result => {
    // Si hubo un error devuelvo el mensaje
    if (!result.success) {
      res.json(result);
    } else {
      // Sino devuelvo el sueño
      res.json(result.dream);
    }
  });
});

// GET para obtener sueños por tags
explorerRouter.get("/dreams", (req, res) =>{
  let tags = req.query.tags.split(",");
  tags = tags.map(tag => tag.trim());
  dream.getDreamsByTags(tags, result => {
    // Si hubo un error devuelvo el mensaje
    if (!result.success) {
      res.json(result);
    } else {
      // Sino devuelvo el array de sueños
      res.json(result.dreams);
    }
  });
});

module.exports = explorerRouter;