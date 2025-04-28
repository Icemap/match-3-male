
import { Menu } from 'lucide-react';

interface GameHeaderProps {
  score: number;
  moves: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ score, moves }) => {
  return (
    <div className="w-full bg-game-header rounded-t-xl px-4 py-2 flex items-center justify-between text-white">
      <button className="p-2 bg-white/20 rounded-md">
        <Menu className="w-6 h-6" />
      </button>
      
      <div className="text-center">
        <div className="font-bold uppercase text-xs tracking-wide">SCORE</div>
        <div className="text-2xl font-black text-yellow-300 drop-shadow-md">{score}</div>
      </div>
      
      <div className="text-center">
        <div className="font-bold uppercase text-xs tracking-wide">MOVES</div>
        <div className="text-2xl font-black text-yellow-300 drop-shadow-md">{moves}</div>
      </div>
    </div>
  );
};

export default GameHeader;
