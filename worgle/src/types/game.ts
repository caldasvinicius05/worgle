// src/types/game.ts

export type CellColor = "none" | "green" | "yellow" | "black";

export interface AttemptResult {
  word: string;
  colors: CellColor[];
}

export interface LeaderboardRow {
  userId: string;
  username: string;
  avatarUrl: string;
  gridColors: CellColor[][];
  attemptsCount: number;
  won: boolean;
}
