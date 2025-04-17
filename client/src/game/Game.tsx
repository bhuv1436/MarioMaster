import { useEffect, useRef, useState } from "react";
import { useAudio } from "../lib/stores/useAudio";
import useGameState from "./useGameState";
import Level from "./Level";
import { Button } from "../components/ui/button";
import GameUI from "./GameUI";
import TouchControls from "./TouchControls";
import { useIsMobile } from "../hooks/use-is-mobile";
import useKeyboard from "../hooks/useKeyboard";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isMobile = useIsMobile();
  
  const {
    gameState,
    setControls,
    update,
    initGame,
    resetGame,
    handleCollisions,
    render,
  } = useGameState(canvasRef);

  const { playHit, playSuccess } = useAudio();

  // Handle keyboard input using our custom hook
  const keyboardControls = useKeyboard();

  // Update controls when keyboard state changes
  useEffect(() => {
    if (!isMobile) {
      setControls(keyboardControls);
    }
  }, [keyboardControls, setControls, isMobile]);

  // Handle touch controls
  const handleTouchControls = (controls: { left: boolean; right: boolean; jump: boolean }) => {
    setControls(controls);
  };

  // Initialize the game
  useEffect(() => {
    initGame();
    console.log("Game initialized");
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [initGame]);

  // Game loop
  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // Check collisions first
      const collisionResult = handleCollisions();
      
      // Play sounds based on collision results
      if (collisionResult.enemyHit) {
        playHit();
      }
      if (collisionResult.coinCollected) {
        playSuccess();
      }
      
      // Update game state
      update(deltaTime);
      
      // Render the game
      render();
      
      // Continue the game loop if the game is active
      if (gameState.status === "playing") {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };
    
    if (gameState.status === "playing") {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState.status, update, render, handleCollisions, playHit, playSuccess]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      {gameState.status === "game-over" && (
        <div className="absolute z-10 flex flex-col items-center justify-center p-6 bg-background/90 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-destructive">Game Over!</h2>
          <p className="mb-4 text-foreground">Score: {gameState.score}</p>
          <Button onClick={resetGame}>Play Again</Button>
        </div>
      )}
      
      {gameState.status === "win" && (
        <div className="absolute z-10 flex flex-col items-center justify-center p-6 bg-background/90 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-primary">Level Complete!</h2>
          <p className="mb-4 text-foreground">Score: {gameState.score}</p>
          <Button onClick={resetGame}>Play Again</Button>
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        className="border border-border rounded-lg shadow-md" 
        width={800} 
        height={600}
      ></canvas>
      
      <GameUI 
        lives={gameState.lives} 
        score={gameState.score} 
        coins={gameState.coins}
      />
      
      {isMobile && gameState.status === "playing" && (
        <TouchControls onControlsChange={handleTouchControls} />
      )}
    </div>
  );
};

export default Game;
