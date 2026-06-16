// src/routes.js
const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const gameController = require("./gameController");

const guessLimiter = rateLimit({
  windowMs: 3 * 1000,
  max: 1,
  message: {
    error: "Calma aí, Cavernoso! Aguarde 3 segundos entre as tentativas.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = function (db) {
  router.get("/game-status", (req, res) =>
    gameController.getGameStatus(req, res, db),
  );
  router.post("/reset", (req, res) => gameController.resetGame(req, res, db));

  router.post("/guess", guessLimiter, (req, res) =>
    gameController.submitGuess(req, res, db),
  );

  return router;
};
