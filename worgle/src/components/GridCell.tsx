// src/components/GridCell.tsx
import type { CellColor } from "../types/game";

interface GridCellProps {
  letter: string;
  colorClass: CellColor;
  isFlipped: boolean;
  isPopped: boolean;
  colIndex: number;
}

export function GridCell({ letter, colorClass, isFlipped, isPopped, colIndex }: GridCellProps) {
  return (
    <div
      className={`cell ${colorClass} ${isFlipped ? "flip" : ""} ${isPopped ? "pop" : ""}`}
      style={{ animationDelay: isFlipped ? `${colIndex * 100}ms` : "0ms" }}
    >
      {letter}
    </div>
  );
}