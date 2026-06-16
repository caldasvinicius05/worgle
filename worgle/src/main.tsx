// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupDiscord } from "./utils/discord.ts";

async function init() {
  try {
    const discordData = await setupDiscord();

    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App
          initialGuildId={discordData.guildId || "cavernosos_server_1"}
          initialUserId={discordData.userId}
        />
      </React.StrictMode>,
    );
  } catch (error) {
    console.error("Erro ao inicializar a Atividade do Discord:", error);

    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App
          initialGuildId="cavernosos_server_1"
          initialUserId="jogador_gogo"
        />
      </React.StrictMode>,
    );
  }
}

init();
