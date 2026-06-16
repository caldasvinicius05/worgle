// src/components/GameGrid.tsx
import { GridRow } from "./GridRow";
import type { AttemptResult } from "../types/game";

interface GameGridProps {
  guesses: AttemptResult[];
  currentGuess: string;
}

export function GameGrid({ guesses, currentGuess }: GameGridProps) {
  return (
    <div className="grid-container">
      {[...Array(6)].map((_, rowIndex) => (
        <GridRow
          key={rowIndex}
          rowIndex={rowIndex}
          guessesLength={guesses.length}
          rowGuess={guesses[rowIndex]}
          currentGuess={currentGuess}
        />
      ))}
    </div>
  );
}