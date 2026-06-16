import type { LeaderboardRow } from "../types/game";

interface PlayerCardProps {
  player: LeaderboardRow;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const isCurrentUser = player.userId === "jogador_gogo";

  const handleShare = () => {
    alert("Copiado para a área de transferência!");
  };

  return (
    <div className={`player-card ${isCurrentUser ? "active-user" : ""}`}>
      <div className="avatar-wrapper">
        <img
          src={player.avatarUrl}
          alt={player.username}
          className="player-avatar"
        />
      </div>

      <div className="mini-grid">
        {[...Array(6)].map((_, rowIndex) => {
          const rowColors = player.gridColors[rowIndex];

          return (
            <div key={rowIndex} className="mini-grid-row">
              {[...Array(5)].map((_, colIndex) => {
                const color = rowColors ? rowColors[colIndex] : "none";
                return <div key={colIndex} className={`mini-cell ${color}`} />;
              })}
            </div>
          );
        })}
      </div>

      {isCurrentUser && (
        <button className="share-status-btn" onClick={handleShare}>
          Share ↗
        </button>
      )}
    </div>
  );
}
