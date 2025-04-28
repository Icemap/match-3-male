
import React, { useState } from 'react';
import GameBoard from '@/components/GameBoard';
import GameHeader from '@/components/GameHeader';

const Index = () => {
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(64);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Sports Match</h1>
      <div className="max-w-sm w-full mx-auto rounded-xl overflow-hidden shadow-2xl">
        <GameHeader score={score} moves={moves} />
        <GameBoard 
          onScoreUpdate={setScore}
          onMovesUpdate={setMoves}
        />
      </div>
    </div>
  );
};

export default Index;
