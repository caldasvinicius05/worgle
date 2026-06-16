import { PlayerCard } from "./PlayerCard";
import type { LeaderboardRow } from "../types/game";
import { CountdownTimer } from "./CountdownTimer";

interface NytResultsProps {
  leaderboard: LeaderboardRow[];
}

export function NytResults({ leaderboard }: NytResultsProps) {
  return (
    <div className="nyt-results-container">
      <div className="players-cards-grid">
        {leaderboard.map((player) => (
          <PlayerCard key={player.userId} player={player} />
        ))}
      </div>

      <hr className="nyt-divider" />

      <div className="stats-section">
        <h3 className="stats-title">CAVERNOSOS STATISTICS</h3>
        <div className="stats-counters">
          <div className="stat-box">
            <span className="stat-number">100%</span>
            <span className="stat-label">Win Rate</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">18 Days</span>
            <span className="stat-label">Current Streak</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">18 Days</span>
            <span className="stat-label">Best Streak</span>
          </div>
        </div>

        <CountdownTimer />
      </div>
    </div>
  );
}
