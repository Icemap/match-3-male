
import React, { useEffect, useState } from 'react';
import GamePieceComponent from './GamePiece';
import { GamePiece, GameState } from '@/types/game';
import { 
  initializeBoard, 
  findMatches, 
  areAdjacent,
  findSpecialMatches,
  getPiecesToClear,
  generateId,
  generateRandomPieceType
} from '@/utils/gameUtils';
import { toast } from '@/components/ui/use-toast';

interface GameBoardProps {
  onScoreUpdate: (newScore: number) => void;
  onMovesUpdate: (newMoves: number) => void;
}

const ROWS = 6;
const COLS = 6;
const INITIAL_MOVES = 64;

const GameBoard: React.FC<GameBoardProps> = ({ onScoreUpdate, onMovesUpdate }) => {
  const [gameState, setGameState] = useState<GameState>({
    board: initializeBoard(ROWS, COLS),
    score: 0,
    moves: INITIAL_MOVES,
    selectedPiece: null,
    isSwapping: false,
    isChecking: false,
  });
  
  // Initialize the game
  useEffect(() => {
    startGame();
  }, []);
  
  const startGame = () => {
    const initialBoard = initializeBoard(ROWS, COLS);
    
    setGameState({
      board: initialBoard,
      score: 0,
      moves: INITIAL_MOVES,
      selectedPiece: null,
      isSwapping: false,
      isChecking: false,
    });
    
    onScoreUpdate(0);
    onMovesUpdate(INITIAL_MOVES);
  };
  
  const handlePieceClick = (piece: GamePiece) => {
    if (gameState.isSwapping || gameState.isChecking) return;
    
    const { selectedPiece, board } = gameState;
    
    // If no piece is selected, select this one
    if (!selectedPiece) {
      setGameState({ ...gameState, selectedPiece: piece });
      return;
    }
    
    // If the same piece is clicked again, deselect it
    if (selectedPiece.id === piece.id) {
      setGameState({ ...gameState, selectedPiece: null });
      return;
    }
    
    // Check if the pieces are adjacent
    if (areAdjacent(selectedPiece, piece)) {
      // Attempt to swap
      handleSwap(selectedPiece, piece);
    } else {
      // Not adjacent, select the new piece instead
      setGameState({ ...gameState, selectedPiece: piece });
    }
  };
  
  const handleSwap = async (piece1: GamePiece, piece2: GamePiece) => {
    // Prevent further interactions during the swap
    setGameState(prevState => ({
      ...prevState,
      isSwapping: true,
      selectedPiece: null
    }));
    
    // Create a copy of the board
    const newBoard = JSON.parse(JSON.stringify(gameState.board));
    
    // Store original positions
    const row1 = piece1.row;
    const col1 = piece1.col;
    const row2 = piece2.row;
    const col2 = piece2.col;
    
    // Swap the pieces in the board
    [newBoard[row1][col1], newBoard[row2][col2]] = [
      {...newBoard[row2][col2], row: row1, col: col1},
      {...newBoard[row1][col1], row: row2, col: col2}
    ];
    
    // Check if the swap creates a match
    const matches = findMatches(newBoard);
    const specialMatches: GamePiece[] = [];
    let specialPiece = null;
    
    // Check for special matches
    if (matches.length === 0) {
      // Check for special piece activations
      if (newBoard[row1][col1].special) {
        specialMatches.push(...getPiecesToClear(newBoard, newBoard[row1][col1]));
      }
      
      if (newBoard[row2][col2].special) {
        specialMatches.push(...getPiecesToClear(newBoard, newBoard[row2][col2]));
      }
    } else {
      // Check if this swap creates a special piece
      specialPiece = findSpecialMatches(newBoard, row1, col1, row2, col2);
    }
    
    // If no matches and no special pieces were activated, revert the swap
    if (matches.length === 0 && specialMatches.length === 0) {
      // Swap pieces back
      [newBoard[row1][col1], newBoard[row2][col2]] = [
        {...newBoard[row2][col2], row: row2, col: col2},
        {...newBoard[row1][col1], row: row1, col: col1}
      ];
      
      setGameState(prevState => ({ 
        ...prevState, 
        board: newBoard,
        isSwapping: false
      }));
      
      toast({
        title: "Invalid move",
        description: "That move doesn't create a match!",
        variant: "destructive",
      });
      
      return;
    }
    
    // Valid move, update moves
    const newMoves = gameState.moves - 1;
    onMovesUpdate(newMoves);
    
    // Create a special piece if applicable
    if (specialPiece) {
      newBoard[specialPiece.piece.row][specialPiece.piece.col].special = specialPiece.type;
    }
    
    // Process the matches and update the board
    await processMatches([...matches, ...specialMatches], newBoard, specialPiece !== null);
  };
  
  const processMatches = async (
    matches: GamePiece[], 
    board: GamePiece[][], 
    hasSpecialPiece: boolean = false
  ) => {
    if (matches.length === 0) {
      setGameState(prevState => ({ 
        ...prevState, 
        board, 
        isSwapping: false,
        isChecking: false,
        moves: prevState.moves - (hasSpecialPiece ? 0 : 1)
      }));
      return;
    }
    
    // Calculate score for the matches
    const matchScore = matches.length * 10;
    const newScore = gameState.score + matchScore;
    
    // Update the score display
    onScoreUpdate(newScore);
    
    // Mark matches for removal
    const newBoard = JSON.parse(JSON.stringify(board));
    const matchPositions = new Set<string>();
    
    matches.forEach(piece => {
      matchPositions.add(`${piece.row},${piece.col}`);
    });
    
    // Remove matched pieces and drop pieces above them
    for (let col = 0; col < COLS; col++) {
      let emptyCount = 0;
      
      // Count empty spaces and move pieces down
      for (let row = ROWS - 1; row >= 0; row--) {
        const position = `${row},${col}`;
        
        if (matchPositions.has(position)) {
          emptyCount++;
        } else if (emptyCount > 0) {
          // Move piece down
          newBoard[row + emptyCount][col] = {
            ...newBoard[row][col],
            row: row + emptyCount
          };
          
          // Clear the original position
          newBoard[row][col] = null;
        }
      }
      
      // Fill the top with new pieces
      for (let i = 0; i < emptyCount; i++) {
        const newRow = emptyCount - i - 1;
        if (newRow >= 0 && newRow < ROWS) {
          newBoard[newRow][col] = {
            id: generateId(),
            type: generateRandomPieceType(),
            row: newRow,
            col: col
          };
        }
      }
    }
    
    // Update the board state
    setGameState(prevState => ({
      ...prevState,
      board: newBoard,
      score: newScore,
      isChecking: true
    }));
    
    // Wait for pieces to fall
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check for new matches
    const newMatches = findMatches(newBoard);
    
    if (newMatches.length > 0) {
      // Process cascade matches
      await processMatches(newMatches, newBoard, false);
    } else {
      // No more matches
      setGameState(prevState => ({
        ...prevState,
        board: newBoard,
        score: newScore,
        isSwapping: false,
        isChecking: false
      }));
      
      // Check for game over
      if (gameState.moves <= 1) {
        toast({
          title: "Game Over!",
          description: `Final score: ${newScore}`,
        });
      }
    }
  };
  
  return (
    <div className="bg-game-board-bg p-2 rounded-b-xl">
      <div className="grid grid-cols-6 grid-rows-6 gap-0 bg-blue-100/50">
        {gameState.board.map(row => 
          row.map(piece => piece && (
            <GamePieceComponent
              key={piece.id}
              piece={piece}
              isSelected={gameState.selectedPiece?.id === piece.id}
              onClick={() => handlePieceClick(piece)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
