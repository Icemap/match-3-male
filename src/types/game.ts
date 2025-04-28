
export type PieceType = 'basketball' | 'football' | 'baseball' | 'tennisball' | 'blocker';
export type SpecialPieceType = 'horizontal-striped' | 'vertical-striped';

export interface GamePiece {
  id: string;
  type: PieceType;
  special?: SpecialPieceType;
  row: number;
  col: number;
}

export interface GameState {
  board: GamePiece[][];
  score: number;
  moves: number;
  selectedPiece: GamePiece | null;
  isSwapping: boolean;
  isChecking: boolean;
}
