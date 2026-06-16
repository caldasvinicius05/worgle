// src/hooks/useWorgleApi.ts
import { useState, useEffect } from "react";
import axios from "axios";
import type { CellColor, AttemptResult, LeaderboardRow } from "../types/game";

const API_URL = import.meta.env.VITE_API_URL;

export function useWorgleApi(
  gameStarted: boolean,
  guildId: string,
  userId: string,
) {
  const [guesses, setGuesses] = useState<AttemptResult[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>(
    "Boa sorte no Worgle!",
  );
  const [letterStatuses, setLetterStatuses] = useState<{
    [key: string]: CellColor;
  }>({});
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);

  const updateKeyboardWithRealColors = (attempt: AttemptResult) => {
    setLetterStatuses((prev) => {
      const newStatuses = { ...prev };

      attempt.word.split("").forEach((letter, index) => {
        const realColor = attempt.colors[index];
        const currentColor = newStatuses[letter];

        if (currentColor === "green") return;
        if (currentColor === "yellow" && realColor === "black") return;

        newStatuses[letter] = realColor;
      });

      return newStatuses;
    });
  };

  useEffect(() => {
    if (!gameStarted) return;

    const fetchGameStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/game-status`, {
          params: { guildId, userId },
        });
        const {
          attempts,
          won,
          leaderboard: incomingLeaderboard,
        } = response.data;

        setGuesses(attempts);
        if (incomingLeaderboard) setLeaderboard(incomingLeaderboard);

        attempts.forEach((attempt: AttemptResult) =>
          updateKeyboardWithRealColors(attempt),
        );

        if (won) {
          setGameMessage("WORGLE FINALIZADO. ATÉ AMANHÃ.");
          setGameOver(true);
        } else if (attempts.length >= 6) {
          setGameMessage("Fim de jogo! Você esgotou suas tentativas.");
          setGameOver(true);
        }
      } catch (error) {
        console.error("Erro ao buscar status:", error);
        setGameMessage("Erro de conexão com o servidor.");
      }
    };
    fetchGameStatus();
  }, [gameStarted, guildId, userId]);

  const submitGuess = async (guessUpper: string) => {
    try {
      const response = await axios.post(`${API_URL}/guess`, {
        guildId,
        userId,
        guess: guessUpper,
      });
      const { attempts, won, leaderboard: incomingLeaderboard } = response.data;

      setGuesses(attempts);
      if (incomingLeaderboard) setLeaderboard(incomingLeaderboard);

      const lastAttempt = attempts[attempts.length - 1];
      if (lastAttempt) {
        updateKeyboardWithRealColors(lastAttempt);
      }

      if (won) {
        setGameMessage("Avaliando palpite...");
        setTimeout(() => {
          setGameMessage("WORGLE FINALIZADO. ATÉ AMANHÃ.");
          setGameOver(true);
        }, 1000);
      } else if (attempts.length >= 6) {
        setGameMessage("Avaliando palpite...");
        setTimeout(() => {
          setGameMessage("Fim de jogo! Você esgotou suas 6 tentativas.");
          setGameOver(true);
        }, 1000);
      }
    } catch (error: unknown) {
      console.error("Erro ao enviar palpite:", error);
      if (axios.isAxiosError(error) && error.response?.data) {
        setGameMessage(error.response.data.error || "Erro no servidor.");
      } else {
        setGameMessage("Houve um erro na comunicação.");
      }
    }
  };

  return {
    guesses,
    currentGuess,
    setCurrentGuess,
    gameOver,
    gameMessage,
    setGameMessage,
    letterStatuses,
    leaderboard,
    submitGuess,
  };
}
