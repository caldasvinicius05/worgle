require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { setupDatabase } = require("./database");
const initializeRoutes = require("./src/routes");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

setupDatabase()
  .then((databaseInstance) => {
    app.use("/api", initializeRoutes(databaseInstance));

    app.listen(PORT, () => {
      console.log(`🚀 Worgle-Backend ligado com sucesso na porta ${PORT}!`);
    });
  })
  .catch((err) => {
    console.error(
      "Falha crítica ao iniciar o banco de dados do Worgle:",
      err,
    );
  });
,