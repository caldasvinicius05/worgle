// src/App.tsx
import { useState } from "react";
import { useWorgleApi } from "./hooks/useWorgleApi";
import { useKeyboardEvents } from "./hooks/useKeyboardEvents";
import { GameGrid } from "./components/GameGrid";
import Keyboard from "./components/Keyboard";
import { NytResults } from "./components/NytResults";
import axios from "axios";

interface AppProps {
  initialGuildId: string;
  initialUserId: string;
}

export default function App({ initialGuildId, initialUserId }: AppProps) {
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const api = useWorgleApi(gameStarted, initialGuildId, initialUserId);

  const isDevelopmentMode = window.self === window.top;

  const { handleInput } = useKeyboardEvents({
    gameStarted,
    gameOver: api.gameOver,
    currentGuess: api.currentGuess,
    setCurrentGuess: api.setCurrentGuess,
    setGameMessage: api.setGameMessage,
    submitGuess: api.submitGuess,
  });

  const handleTestReset = async () => {
    try {
      await axios.post("http://localhost:3000/api/reset", {
        guildId: initialGuildId,
        userId: initialUserId,
      });
      window.location.reload();
    } catch (error) {
      console.error("Erro ao resetar jogo de teste:", error);
    }
  };

  if (!gameStarted) {
    return (
      <div className="welcome-container">
        <h1 className="welcome-title">WORGLE</h1>
        <p className="welcome-subtitle">Bem-vindo ao Worgle dos Cavernosos</p>
        <p className="welcome-credits">Feito com amor para gogó</p>
        <button className="start-btn" onClick={() => setGameStarted(true)}>
          INICIAR JOGO
        </button>
      </div>
    );
  }

  return (
    <div className="worgle-container fade-in">
      <h2>WORGLE</h2>
      <div className="game-message">{api.gameMessage}</div>

      {!api.gameOver ? (
        <>
          <GameGrid guesses={api.guesses} currentGuess={api.currentGuess} />
          <Keyboard
            onKeyPress={handleInput}
            letterStatuses={api.letterStatuses}
          />
        </>
      ) : (
        <div className="game-over-screen">
          <NytResults leaderboard={api.leaderboard} />

          {isDevelopmentMode && (
            <div
              style={{
                marginTop: "40px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleTestReset}
                style={{
                  backgroundColor: "#222",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                🔄 Forçar Novo Jogo (Reset de Teste)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
