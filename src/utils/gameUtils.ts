import { GamePiece, PieceType } from '@/types/game';

const PIECE_TYPES: PieceType[] = ['pingpong', 'eightball', 'swimmer', 'basketball'];

export const generateRandomPieceType = (): PieceType => {
  // 10% chance to generate a blocker
  if (Math.random() < 0.1) {
    return 'blocker';
  }
  
  const index = Math.floor(Math.random() * PIECE_TYPES.length);
  return PIECE_TYPES[index];
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const initializeBoard = (rows: number, cols: number): GamePiece[][] => {
  const board: GamePiece[][] = [];
  
  for (let row = 0; row < rows; row++) {
    const boardRow: GamePiece[] = [];
    for (let col = 0; col < cols; col++) {
      boardRow.push({
        id: generateId(),
        type: generateRandomPieceType(),
        row,
        col,
      });
    }
    board.push(boardRow);
  }
  
  // Make sure no matches exist at initialization
  let hasMatches = true;
  while (hasMatches) {
    hasMatches = false;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (board[row][col].type !== 'blocker' && 
            (checkHorizontalMatch(board, row, col) || checkVerticalMatch(board, row, col))) {
          board[row][col].type = generateRandomPieceType();
          hasMatches = true;
        }
      }
    }
  }
  
  return board;
};

export const checkHorizontalMatch = (board: GamePiece[][], row: number, col: number): boolean => {
  if (col < 2) return false;
  
  const pieceType = board[row][col].type;
  if (pieceType === 'blocker') return false;
  
  return (
    board[row][col-1]?.type === pieceType && 
    board[row][col-2]?.type === pieceType
  );
};

export const checkVerticalMatch = (board: GamePiece[][], row: number, col: number): boolean => {
  if (row < 2) return false;
  
  const pieceType = board[row][col].type;
  if (pieceType === 'blocker') return false;
  
  return (
    board[row-1]?.[col]?.type === pieceType && 
    board[row-2]?.[col]?.type === pieceType
  );
};

export const findMatches = (board: GamePiece[][]) => {
  const rows = board.length;
  const cols = board[0].length;
  const matches: GamePiece[] = [];
  const matchedPositions: Set<string> = new Set();
  
  // Check horizontal matches
  for (let row = 0; row < rows; row++) {
    let matchCount = 1;
    let currentType = '';
    
    for (let col = 0; col < cols; col++) {
      const piece = board[row][col];
      if (piece.type === 'blocker') {
        // Reset match for blockers
        if (matchCount >= 3) {
          // Add previous matches
          for (let i = 1; i <= matchCount; i++) {
            const pos = `${row},${col-i}`;
            if (!matchedPositions.has(pos)) {
              matchedPositions.add(pos);
              matches.push(board[row][col-i]);
            }
          }
        }
        matchCount = 1;
        currentType = '';
        continue;
      }
      
      if (piece.type === currentType) {
        matchCount++;
      } else {
        if (matchCount >= 3) {
          // Add previous matches
          for (let i = 1; i <= matchCount; i++) {
            const pos = `${row},${col-i}`;
            if (!matchedPositions.has(pos)) {
              matchedPositions.add(pos);
              matches.push(board[row][col-i]);
            }
          }
        }
        matchCount = 1;
        currentType = piece.type;
      }
    }
    
    // Check matches at the end of row
    if (matchCount >= 3) {
      for (let i = 1; i <= matchCount; i++) {
        const pos = `${row},${cols-i}`;
        if (!matchedPositions.has(pos)) {
          matchedPositions.add(pos);
          matches.push(board[row][cols-i]);
        }
      }
    }
  }
  
  // Check vertical matches
  for (let col = 0; col < cols; col++) {
    let matchCount = 1;
    let currentType = '';
    
    for (let row = 0; row < rows; row++) {
      const piece = board[row][col];
      if (piece.type === 'blocker') {
        // Reset match for blockers
        if (matchCount >= 3) {
          // Add previous matches
          for (let i = 1; i <= matchCount; i++) {
            const pos = `${row-i},${col}`;
            if (!matchedPositions.has(pos)) {
              matchedPositions.add(pos);
              matches.push(board[row-i][col]);
            }
          }
        }
        matchCount = 1;
        currentType = '';
        continue;
      }
      
      if (piece.type === currentType) {
        matchCount++;
      } else {
        if (matchCount >= 3) {
          // Add previous matches
          for (let i = 1; i <= matchCount; i++) {
            const pos = `${row-i},${col}`;
            if (!matchedPositions.has(pos)) {
              matchedPositions.add(pos);
              matches.push(board[row-i][col]);
            }
          }
        }
        matchCount = 1;
        currentType = piece.type;
      }
    }
    
    // Check matches at the end of column
    if (matchCount >= 3) {
      for (let i = 1; i <= matchCount; i++) {
        const pos = `${rows-i},${col}`;
        if (!matchedPositions.has(pos)) {
          matchedPositions.add(pos);
          matches.push(board[rows-i][col]);
        }
      }
    }
  }
  
  // Check adjacent blockers to matches
  const blockers: GamePiece[] = [];
  matches.forEach(piece => {
    const { row, col } = piece;
    
    // Check adjacent cells
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (
        newRow >= 0 && 
        newRow < rows && 
        newCol >= 0 && 
        newCol < cols &&
        board[newRow][newCol].type === 'blocker'
      ) {
        const pos = `${newRow},${newCol}`;
        if (!matchedPositions.has(pos)) {
          matchedPositions.add(pos);
          blockers.push(board[newRow][newCol]);
        }
      }
    });
  });
  
  return [...matches, ...blockers];
};

export const findSpecialMatches = (board: GamePiece[][], row1: number, col1: number, row2: number, col2: number) => {
  const rows = board.length;
  const cols = board[0].length;
  let specialPiece: { piece: GamePiece, type: 'horizontal-striped' | 'vertical-striped' } | null = null;

  // Check for match-4 horizontally
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col <= cols - 4; col++) {
      const piece = board[row][col];
      if (
        piece.type !== 'blocker' &&
        piece.type === board[row][col+1]?.type &&
        piece.type === board[row][col+2]?.type &&
        piece.type === board[row][col+3]?.type
      ) {
        // Check if any of the matched pieces were involved in the swap
        for (let i = 0; i < 4; i++) {
          if ((row === row1 && col + i === col1) || (row === row2 && col + i === col2)) {
            // Create a horizontal striped piece
            specialPiece = {
              piece: board[row][col + i],
              type: 'horizontal-striped'
            };
            break;
          }
        }
      }
    }
  }

  // Check for match-4 vertically
  if (!specialPiece) {
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row <= rows - 4; row++) {
        const piece = board[row][col];
        if (
          piece.type !== 'blocker' &&
          piece.type === board[row+1]?.[col]?.type &&
          piece.type === board[row+2]?.[col]?.type &&
          piece.type === board[row+3]?.[col]?.type
        ) {
          // Check if any of the matched pieces were involved in the swap
          for (let i = 0; i < 4; i++) {
            if ((row + i === row1 && col === col1) || (row + i === row2 && col === col2)) {
              // Create a vertical striped piece
              specialPiece = {
                piece: board[row + i][col],
                type: 'vertical-striped'
              };
              break;
            }
          }
        }
      }
    }
  }

  return specialPiece;
};

export const getPiecesToClear = (board: GamePiece[][], piece: GamePiece) => {
  const rows = board.length;
  const cols = board[0].length;
  const piecesToClear: GamePiece[] = [];

  if (piece.special === 'horizontal-striped') {
    // Clear entire row
    for (let col = 0; col < cols; col++) {
      piecesToClear.push(board[piece.row][col]);
    }
  } else if (piece.special === 'vertical-striped') {
    // Clear entire column
    for (let row = 0; row < rows; row++) {
      piecesToClear.push(board[row][piece.col]);
    }
  }

  return piecesToClear;
};

export const areAdjacent = (piece1: GamePiece, piece2: GamePiece) => {
  // Check if pieces are adjacent (horizontally or vertically)
  return (
    (Math.abs(piece1.row - piece2.row) === 1 && piece1.col === piece2.col) ||
    (Math.abs(piece1.col - piece2.col) === 1 && piece1.row === piece2.row)
  );
};
