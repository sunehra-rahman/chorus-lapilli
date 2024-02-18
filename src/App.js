
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  //get the adjacent empty squares
  const adjacentSquares = (i) => {
    const adjacent = [
      [1, 3, 4],       // 0
      [0, 2, 3, 4, 5], // 1
      [1, 4, 5],       // 2
      [0, 1, 4, 6, 7], // 3
      [0, 1, 2, 3, 5, 6, 7, 8], // 4
      [2, 1, 4, 8, 7], // 5
      [3, 4, 7],       // 6
      [6, 3, 4, 5, 8], // 7
      [7, 4, 5],       // 8
    ];
    return adjacent[i];
  };

  function handleClick(i) {
    //also checks if more than three squares are filled on the board
    //filter iterates over each square
    //uses arrow function to see if square is null or not
    if (calculateWinner(squares) || squares[i] && squares.filter(square => square).length > 3) {
      return;
    }
    const nextSquares = squares.slice();
    //count filled squares
    const squareCount = nextSquares.filter(x => x).length;
    if (squareCount >= 3) { //if three moves have been made
      let validMove = false; //track if validMove was made
      for (let j = 0; j < nextSquares.length; j++) { //traverse current state of the game
        //if the square has current player's mark
        //and if the square is indeed an adjacent square
        //and if that square if empty
        if (nextSquares[j] === (xIsNext ? 'X' : 'O') && adjacentSquares(j).includes(i) && !nextSquares[i]) {
          nextSquares[j] = null; //empty current square
          nextSquares[i] = xIsNext ? 'X' : 'O'; //fill adjacent square with player's piece
          validMove = true; //break from loop and set validMove as true
          break;
        }
      }
      if (!validMove) return; // Invalid move
    } else {
      // if fewer than three moves
      nextSquares[i] = xIsNext ? 'X' : 'O'; //just set the square with the piece
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}