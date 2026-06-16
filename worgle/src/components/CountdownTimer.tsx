// src/components/CountdownTimer.tsx
import { useState, useEffect } from "react";

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    function updateTimer() {
      const now = new Date();
      const nextReset = new Date();
      nextReset.setHours(24, 0, 0, 0);

      const diff = nextReset.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Disponível! Recarregue.");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const hStr = hours.toString().padStart(2, "0");
      const mStr = minutes.toString().padStart(2, "0");
      const sStr = seconds.toString().padStart(2, "0");

      setTimeLeft(`${hStr}:${mStr}:${sStr}`);
    }

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="countdown-container"
      style={{ textAlign: "center", marginTop: "15px" }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.85rem",
          color: "#787c7e",
          fontWeight: "bold",
          letterSpacing: "1px",
        }}
      >
        PRÓXIMA PALAVRA EM
      </p>
      <span
        style={{
          fontSize: "1.8rem",
          fontWeight: "bold",
          fontFamily: "monospace",
          color: "#000",
        }}
      >
        {timeLeft}
      </span>
    </div>
  );
}
