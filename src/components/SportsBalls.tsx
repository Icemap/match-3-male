
import { SpecialPieceType } from '@/types/game';
import { cn } from '@/lib/utils';

interface SportsBallProps {
  special?: SpecialPieceType;
}

export const Basketball: React.FC<SportsBallProps> = ({ special }) => {
  return (
    <div className={cn(
      "w-[42px] h-[42px] bg-game-orange rounded-full relative overflow-hidden",
      "flex items-center justify-center",
      special === 'horizontal-striped' ? "bg-gradient-to-r from-game-orange via-white to-game-orange" : "",
      special === 'vertical-striped' ? "bg-gradient-to-b from-game-orange via-white to-game-orange" : ""
    )}>
      {!special && (
        <>
          <div className="absolute w-full h-[2px] bg-black top-[45%]"></div>
          <div className="absolute w-full h-[2px] bg-black top-[55%]"></div>
          <div className="absolute h-full w-[2px] bg-black left-[45%]"></div>
          <div className="absolute h-full w-[2px] bg-black left-[55%]"></div>
        </>
      )}
    </div>
  );
};

export const Football: React.FC<SportsBallProps> = ({ special }) => {
  return (
    <div className={cn(
      "w-[42px] h-[42px] bg-game-brown rounded-md transform rotate-45",
      "flex items-center justify-center",
      special === 'horizontal-striped' ? "bg-gradient-to-r from-game-brown via-white to-game-brown" : "",
      special === 'vertical-striped' ? "bg-gradient-to-b from-game-brown via-white to-game-brown" : ""
    )}>
      {!special && (
        <div className="w-[20px] h-[2px] bg-white"></div>
      )}
    </div>
  );
};

export const Baseball: React.FC<SportsBallProps> = ({ special }) => {
  return (
    <div className={cn(
      "w-[42px] h-[42px] bg-white rounded-full border-2 border-gray-300",
      "flex items-center justify-center",
      special === 'horizontal-striped' ? "bg-gradient-to-r from-white via-red-200 to-white" : "",
      special === 'vertical-striped' ? "bg-gradient-to-b from-white via-red-200 to-white" : ""
    )}>
      {!special && (
        <div className="w-[30px] h-[30px] border-[2px] border-red-400 border-dashed rounded-full"></div>
      )}
    </div>
  );
};

export const TennisBall: React.FC<SportsBallProps> = ({ special }) => {
  return (
    <div className={cn(
      "w-[42px] h-[42px] bg-game-yellow rounded-full",
      "flex items-center justify-center",
      special === 'horizontal-striped' ? "bg-gradient-to-r from-game-yellow via-white to-game-yellow" : "",
      special === 'vertical-striped' ? "bg-gradient-to-b from-game-yellow via-white to-game-yellow" : ""
    )}>
      {!special && (
        <div className="w-[30px] h-[30px] border-[2px] border-white border-dashed rounded-full"></div>
      )}
    </div>
  );
};
