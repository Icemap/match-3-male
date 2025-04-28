
import React, { useState } from 'react';
import GameBoard from '@/components/GameBoard';
import GameHeader from '@/components/GameHeader';

const Index = () => {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(64);

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center relative bg-gradient-to-b from-[#87CEEB] to-[#4682B4]"
      style={{
        backgroundImage: 'url("/lovable-uploads/4fad1b88-d6e5-43cf-8190-29b85f519aae.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">Sports Match</h1>
        <div className="max-w-sm w-full mx-auto rounded-xl overflow-hidden shadow-2xl bg-white/90 backdrop-blur">
          <GameHeader score={score} moves={moves} />
          <GameBoard 
            onScoreUpdate={setScore}
            onMovesUpdate={setMoves}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
