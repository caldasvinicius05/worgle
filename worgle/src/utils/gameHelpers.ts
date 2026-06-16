import type { CellColor } from "../types/game";

export const getCellColor = (
  letter: string,
  index: number,
  rowGuess: string,
): CellColor => {
  const LOCAL_SECRET = "SAGAZ";

  if (LOCAL_SECRET[index] === letter) return "green";
  if (!LOCAL_SECRET.includes(letter)) return "black";

  const totalSecretOccurrences = LOCAL_SECRET.split("").filter(
    (l) => l === letter,
  ).length;
  const greenOccurrences = LOCAL_SECRET.split("").filter(
    (l, i) => l === letter && rowGuess[i] === letter,
  ).length;
  const occurrencesUntilNow = rowGuess
    .slice(0, index + 1)
    .split("")
    .filter((l) => l === letter).length;

  if (occurrencesUntilNow <= totalSecretOccurrences - greenOccurrences) {
    return "yellow";
  }
  return "black";
};
