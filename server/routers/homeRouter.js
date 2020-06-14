const express = require("express");

const homeRouter = express.Router();

homeRouter.get("/", (req, res) => {
  if (req.session.currentUser) {
    res.render("home", {
      layout: "main",
      user: req.session.currentUser
    });
  } else {
    res.redirect("/");
  }
});

module.exports = homeRouter;