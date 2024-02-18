import { useState } from 'react';

//Square is nchanges
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ squares, onSquareClick }) {
  return (
    <div>
      {[0, 1, 2].map(row => ( //loop over each row
        <div key={row} className="board-row">
          {[0, 1, 2].map(col => { //loop over each column
            const index = row * 3 + col; 
            return (
              //Render Square component with value from squares 
              //at the index and onSquareClick event
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => onSquareClick(index)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function Game() {
  //track the number of moves played in the game.
  const [move, setMove] = useState(0);
  //remember the index of the last move made
  const [last, setLast] = useState(null);
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  //track whether a piece was selected to move
  const [cur, setCur] = useState(false);
  

  function handleClick(i) {
    //If there is a winner or the square is already filled 
    //and move is less than or equal to 5, return early
    if (calculateWinner(squares) || (squares[i] && move <= 5)) {
      return;
    }
    const nextSquares = squares.slice(); //Copy squares array to nextSquares
    if (cur) {
      let neighbors = getAdjacentSquares(last); 
      //if the square clicked by the player contains their piece
      //mark that piece as the currently selected piece 
      //update the last state to remember which piece was selected
      if (nextSquares[i] === (xIsNext ? 'X' : 'O')) {
        setCur(true);
        setLast(i);
      }
      //if a player moves a piece from the center square
      //the move must result in a win or must vacate the center square
      if (nextSquares[4] === (xIsNext ? 'X' : 'O')) {
        const moveWin = findPotentialWinMoves(nextSquares, xIsNext, last);
        if (moveWin && moveWin.includes(i) && neighbors.includes(i) && nextSquares[i] === null) {
          nextSquares[i] = (xIsNext ? 'X' : 'O');
          nextSquares[last] = null;
          setMove(move + 1);  
          setXIsNext(!xIsNext);
          setCur(false);
        }
        else if (moveWin === null && last === 4 && nextSquares[i] === null) {
          nextSquares[i] = (xIsNext ? 'X' : 'O');
          nextSquares[last] = null;
          setMove(move + 1);  
          setXIsNext(!xIsNext);
          setCur(false);
        }
      }
      else {
        if (nextSquares[i] === null && neighbors.includes(i)) {
          nextSquares[i] = (xIsNext ? 'X' : 'O');
          nextSquares[last] = null;
          setMove(move + 1);     
          setXIsNext(!xIsNext);
          setCur(false);
        }
      }
    }
    else {
      if (move <= 5) {
        if (xIsNext) {
          nextSquares[i] = 'X';
        } else {
          nextSquares[i] = 'O';
        }
        setXIsNext(!xIsNext);
        setMove(move + 1);
      }
      else {
        if (nextSquares[i] === (xIsNext ? 'X' : 'O')) {
          setCur(true);
          setLast(i);
        }
        else 
          setCur(false);
      }
    }
    setSquares(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status = winner ? 'Winner: ' + winner : 'Next player: ' + (xIsNext ? 'X' : 'O');

  return (
    <div className="game">
      <div className="status">{status}</div>
      <div className="game-board">
        <Board squares={squares} onSquareClick={handleClick} />
      </div>
    </div>
  );
}

function findPotentialWinMoves(boardState, currentPlayer, selectedSquare) {
  let availableMoves = [];
  let potentialWinningMoves = []; 
  let adjacentSquares = getAdjacentSquares(selectedSquare);

  adjacentSquares.forEach((adjSquare) => { //Loop through adjacent squares
    if (boardState[adjSquare] === null) { //If the square is null
      availableMoves.push(adjSquare); //add it to availableMoves
    }
  });

  availableMoves.forEach((move) => { //Loop through availableMoves
    //If tempBoard results in a win
    //add the move to potentialWinningMoves
    let tempBoard = boardState.slice();
    tempBoard[selectedSquare] = null; // Remove the piece from its current position
    tempBoard[move] = currentPlayer === 'X' ? 'X' : 'O'; // Place it in the new position
    if (calculateWinner(tempBoard)) {
      potentialWinningMoves.push(move);
    }
  });

  return potentialWinningMoves.length > 0 ? potentialWinningMoves : null;
}

//provides the indices of adjacent squares for a given square 
function getAdjacentSquares(square) {
  const adjacentMapping = [
    [1, 3, 4],     // Adjacent to square 0
    [0, 2, 3, 4, 5], // Adjacent to square 1
    [1, 4, 5],     // Adjacent to square 2
    [0, 1, 4, 6, 7], // Adjacent to square 3
    [0, 1, 2, 3, 5, 6, 7, 8], // Adjacent to square 4
    [1, 2, 4, 7, 8], // Adjacent to square 5
    [3, 4, 7],     // Adjacent to square 6
    [3, 4, 5, 6, 8], // Adjacent to square 7
    [4, 5, 7]      // Adjacent to square 8
  ];
  return adjacentMapping[square];
}

//same as before
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