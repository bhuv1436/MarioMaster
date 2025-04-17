import React from "react";

interface GameUIProps {
  lives: number;
  score: number;
  coins: number;
}

const GameUI: React.FC<GameUIProps> = ({ lives, score, coins }) => {
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center p-2 bg-background/80 rounded-md text-foreground">
      <div className="flex items-center gap-2">
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span className="ml-1 font-bold">x{lives}</span>
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          <span className="ml-1 font-bold">{coins}</span>
        </span>
      </div>
      
      <div className="flex items-center">
        <span className="font-bold">Score: {score}</span>
      </div>
    </div>
  );
};

export default GameUI;
