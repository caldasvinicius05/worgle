import type { CellColor } from "../types/game";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStatuses: { [key: string]: CellColor };
}

export default function Keyboard({ onKeyPress, letterStatuses }: KeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ç"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  const getKeyClass = (key: string) => {
    if (key === "ENTER" || key === "BACKSPACE") return "key special-key";
    
    const status = letterStatuses[key];
    if (status) return `key ${status}`;
    
    return "key";
  };

  return (
    <div className="keyboard-container">
      {rows.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {row.map((key) => (
            <button
              key={key}
              className={getKeyClass(key)}
              onClick={() => onKeyPress(key)}
            >
              {key === "BACKSPACE" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}