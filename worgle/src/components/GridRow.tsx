import { GridCell } from "./GridCell";
import type { CellColor, AttemptResult } from "../types/game";

interface GridRowProps {
  rowIndex: number;
  guessesLength: number;
  rowGuess?: AttemptResult;
  currentGuess: string;
}

export function GridRow({
  rowIndex,
  guessesLength,
  rowGuess,
  currentGuess,
}: GridRowProps) {
  const isCurrentRow = rowIndex === guessesLength;
  const isPastRow = rowIndex < guessesLength;

  return (
    <div className="grid-row">
      {[...Array(5)].map((_, colIndex) => {
        let letter = "";
        let colorClass: CellColor = "none";
        let isFlipped = false;
        let isPopped = false;

        if (isPastRow && rowGuess) {
          letter = rowGuess.word[colIndex];
          colorClass = rowGuess.colors[colIndex];
          isFlipped = true;
        } else if (isCurrentRow) {
          letter = currentGuess[colIndex] || "";
          isPopped = letter !== "";
        }

        return (
          <GridCell
            key={colIndex}
            letter={letter}
            colorClass={colorClass}
            isFlipped={isFlipped}
            isPopped={isPopped}
            colIndex={colIndex}
          />
        );
      })}
    </div>
  );
}
