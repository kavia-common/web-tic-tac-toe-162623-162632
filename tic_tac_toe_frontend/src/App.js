import React, { useMemo, useState, useEffect } from 'react';
import './App.css';

/**
 * Modern, minimalistic Tic Tac Toe PvP app
 * - Centered responsive 3x3 board
 * - Status bar and controls below
 * - Light theme and custom color variables using provided palette
 * - Accessible and keyboard navigable
 */

// Utility: winning line indices
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diags
];

/**
 * Returns the winner symbol ('X' | 'O') and winning line indices if any.
 */
function evaluateWinner(squares) {
  for (const [a, b, c] of WIN_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

/**
 * Square button component
 */
function Square({ value, onClick, isWinning, disabled, index }) {
  return (
    <button
      className={`ttt-square ${isWinning ? 'winning' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Cell ${index + 1} ${value ? 'occupied by ' + value : 'empty'}`}
    >
      {value}
    </button>
  );
}

/**
// PUBLIC_INTERFACE
 */
function App() {
  // Theme selection (light only by default to match requirement, keeps switch capability)
  const [theme, setTheme] = useState('light');

  // Board state: 9 cells
  const [squares, setSquares] = useState(Array(9).fill(null));
  // X starts
  const [xIsNext, setXIsNext] = useState(true);

  // Derived state: winner, draw, status
  const { winner, line } = useMemo(() => evaluateWinner(squares), [squares]);
  const isBoardFull = useMemo(() => squares.every(Boolean), [squares]);
  const isDraw = useMemo(() => !winner && isBoardFull, [winner, isBoardFull]);

  const currentPlayer = xIsNext ? 'X' : 'O';

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle clicking a cell
  const handleSquareClick = (idx) => {
    if (squares[idx] || winner) return;
    const next = squares.slice();
    next[idx] = currentPlayer;
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    // Kept to allow extension, though requirement is light theme
    setTheme((t) => (t === 'light' ? 'light' : 'light'));
  };

  let statusText = '';
  if (winner) statusText = `Winner: ${winner}`;
  else if (isDraw) statusText = 'Draw!';
  else statusText = `Next turn: ${currentPlayer}`;

  return (
    <div className="App">
      <main className="ttt-root">
        <section className="ttt-card">
          <header className="ttt-header">
            <h1 className="ttt-title" aria-label="Tic Tac Toe">Tic Tac Toe</h1>
          </header>

          <section className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
            {squares.map((val, i) => (
              <Square
                key={i}
                index={i}
                value={val}
                onClick={() => handleSquareClick(i)}
                isWinning={line.includes(i)}
                disabled={Boolean(val) || Boolean(winner)}
              />
            ))}
          </section>

          <section className="ttt-controls">
            <div className="ttt-status" role="status" aria-live="polite">
              {statusText}
            </div>
            <div className="ttt-actions">
              <button className="btn" onClick={resetGame} aria-label="Reset game">
                Reset
              </button>
            </div>
          </section>
        </section>

        <footer className="ttt-footer">
          <span className="palette-dot primary" title="Primary color" />
          <span className="palette-dot secondary" title="Secondary color" />
          <span className="palette-dot accent" title="Accent color" />
        </footer>
      </main>
    </div>
  );
}

export default App;
