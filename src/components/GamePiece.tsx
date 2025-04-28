
import React from 'react';
import { GamePiece as GamePieceType } from '@/types/game';
import { Basketball, PingPong, EightBall, Swimmer } from '@/components/SportsBalls';
import { cn } from '@/lib/utils';

interface GamePieceProps {
  piece: GamePieceType;
  isSelected: boolean;
  onClick: () => void;
}

const GamePiece: React.FC<GamePieceProps> = ({ piece, isSelected, onClick }) => {
  const renderPiece = () => {
    switch (piece.type) {
      case 'basketball':
        return <Basketball special={piece.special} />;
      case 'pingpong':
        return <PingPong special={piece.special} />;
      case 'eightball':
        return <EightBall special={piece.special} />;
      case 'swimmer':
        return <Swimmer special={piece.special} />;
      case 'blocker':
        return (
          <div className="w-full h-full bg-game-brown rounded-md flex items-center justify-center">
            <div className="w-3/4 h-3/4 bg-game-brown border-2 border-white/30 rounded-md"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "w-[48px] h-[48px] cursor-pointer transition-all m-[2px]",
        "flex items-center justify-center",
        isSelected ? "scale-110 outline outline-2 outline-white" : "",
        piece.special ? "animate-pop" : ""
      )}
      onClick={onClick}
    >
      {renderPiece()}
    </div>
  );
};

export default GamePiece;
