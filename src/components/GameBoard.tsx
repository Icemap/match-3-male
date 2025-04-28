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
  const [newPieces, setNewPieces] = useState<Set<string>>(new Set());
  const [matchedPieces, setMatchedPieces] = useState<Set<string>>(new Set());
  
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
    
    if (!selectedPiece) {
      setGameState({ ...gameState, selectedPiece: piece });
      return;
    }
    
    if (selectedPiece.id === piece.id) {
      setGameState({ ...gameState, selectedPiece: null });
      return;
    }
    
    if (areAdjacent(selectedPiece, piece)) {
      handleSwap(selectedPiece, piece);
    } else {
      setGameState({ ...gameState, selectedPiece: piece });
    }
  };
  
  const handleSwap = async (piece1: GamePiece, piece2: GamePiece) => {
    setGameState(prevState => ({
      ...prevState,
      isSwapping: true,
      selectedPiece: null
    }));
    
    const newBoard = JSON.parse(JSON.stringify(gameState.board));
    
    const row1 = piece1.row;
    const col1 = piece1.col;
    const row2 = piece2.row;
    const col2 = piece2.col;
    
    [newBoard[row1][col1], newBoard[row2][col2]] = [
      {...newBoard[row2][col2], row: row1, col: col1},
      {...newBoard[row1][col1], row: row2, col: col2}
    ];
    
    const matches = findMatches(newBoard);
    const specialMatches: GamePiece[] = [];
    let specialPiece = null;
    
    if (matches.length === 0) {
      if (newBoard[row1][col1].special) {
        specialMatches.push(...getPiecesToClear(newBoard, newBoard[row1][col1]));
      }
      
      if (newBoard[row2][col2].special) {
        specialMatches.push(...getPiecesToClear(newBoard, newBoard[row2][col2]));
      }
    } else {
      specialPiece = findSpecialMatches(newBoard, row1, col1, row2, col2);
    }
    
    if (matches.length === 0 && specialMatches.length === 0) {
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
    
    const newMoves = gameState.moves - 1;
    onMovesUpdate(newMoves);
    
    if (specialPiece) {
      newBoard[specialPiece.piece.row][specialPiece.piece.col].special = specialPiece.type;
    }
    
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
    
    const matchScore = matches.length * 10;
    const newScore = gameState.score + matchScore;
    onScoreUpdate(newScore);
    
    const matchPositions = new Set<string>();
    matches.forEach(piece => {
      matchPositions.add(`${piece.row},${piece.col}`);
    });
    setMatchedPieces(matchPositions);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newBoard = JSON.parse(JSON.stringify(board));
    const newPiecesSet = new Set<string>();
    
    for (let col = 0; col < COLS; col++) {
      let emptyCount = 0;
      
      for (let row = ROWS - 1; row >= 0; row--) {
        const position = `${row},${col}`;
        
        if (matchPositions.has(position)) {
          emptyCount++;
        } else if (emptyCount > 0) {
          newBoard[row + emptyCount][col] = {
            ...newBoard[row][col],
            row: row + emptyCount
          };
          newBoard[row][col] = null;
        }
      }
      
      for (let i = 0; i < emptyCount; i++) {
        const newRow = emptyCount - i - 1;
        if (newRow >= 0 && newRow < ROWS) {
          const newPiece = {
            id: generateId(),
            type: generateRandomPieceType(),
            row: newRow,
            col: col
          };
          newBoard[newRow][col] = newPiece;
          newPiecesSet.add(`${newRow},${col}`);
        }
      }
    }
    
    setNewPieces(newPiecesSet);
    setMatchedPieces(new Set());
    
    setGameState(prevState => ({
      ...prevState,
      board: newBoard,
      score: newScore,
      isChecking: true
    }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMatches = findMatches(newBoard);
    
    if (newMatches.length > 0) {
      await processMatches(newMatches, newBoard, false);
    } else {
      setNewPieces(new Set());
      setGameState(prevState => ({
        ...prevState,
        board: newBoard,
        score: newScore,
        isSwapping: false,
        isChecking: false
      }));
      
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
              isNew={newPieces.has(`${piece.row},${piece.col}`)}
              isMatched={matchedPieces.has(`${piece.row},${piece.col}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
