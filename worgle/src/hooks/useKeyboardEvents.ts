// src/hooks/useKeyboardEvents.ts
import { useEffect, useRef } from "react";

interface KeyboardEventsProps {
  gameStarted: boolean;
  gameOver: boolean;
  currentGuess: string;
  setCurrentGuess: React.Dispatch<React.SetStateAction<string>>;
  setGameMessage: React.Dispatch<React.SetStateAction<string>>;
  submitGuess: (guessUpper: string) => Promise<void>;
}

export function useKeyboardEvents({
  gameStarted,
  gameOver,
  currentGuess,
  setCurrentGuess,
  setGameMessage,
  submitGuess,
}: KeyboardEventsProps) {
  const lastSubmitTimeRef = useRef<number>(0);

  const handleInput = async (key: string) => {
    if (gameOver) return;

    if (key === "ENTER") {
      if (currentGuess.length !== 5) {
        setGameMessage("A palavra precisa ter 5 letras!");
        return;
      }

      const now = Date.now();
      const timeSinceLastSubmit = now - lastSubmitTimeRef.current;

      if (timeSinceLastSubmit < 3000) {
        const secondsLeft = Math.ceil((3000 - timeSinceLastSubmit) / 1000);
        setGameMessage(
          `Aguarde ${secondsLeft}s antes de enviar o próximo palpite.`,
        );
        return; 
      }

      const guessUpper = currentGuess.toUpperCase();
      setCurrentGuess("");

      lastSubmitTimeRef.current = Date.now();

      await submitGuess(guessUpper);
      return;
    }

    if (key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
      setGameMessage("");
      return;
    }

    if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key);
      setGameMessage("");
    }
  };

  const handleInputRef = useRef(handleInput);
  useEffect(() => {
    handleInputRef.current = handleInput;
  });

  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      let key = e.key.toUpperCase();
      if (e.key === "Backspace") key = "BACKSPACE";
      handleInputRef.current(key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted]);

  return { handleInput };
}
