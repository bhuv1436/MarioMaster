import { useCallback, useRef, useState } from "react";
import Player from "./Player";
import Level, { LevelData } from "./Level";
import Enemy from "./Enemy";
import Platform from "./Platform";
import Collectible from "./Collectible";
import useCollision from "./useCollision";
import { levels } from "./levels";

interface GameState {
  status: "ready" | "playing" | "game-over" | "win";
  score: number;
  lives: number;
  coins: number;
  level: number;
}

interface Controls {
  left: boolean;
  right: boolean;
  jump: boolean;
}

const useGameState = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [gameState, setGameState] = useState<GameState>({
    status: "playing",
    score: 0,
    lives: 3,
    coins: 0,
    level: 1,
  });
  
  const playerRef = useRef<Player | null>(null);
  const levelRef = useRef<Level | null>(null);
  const enemyRef = useRef<Enemy | null>(null);
  const platformRef = useRef<Platform | null>(null);
  const collectibleRef = useRef<Collectible | null>(null);
  const controlsRef = useRef<Controls>({ left: false, right: false, jump: false });
  
  const { checkPlayerPlatformCollision, checkPlayerEnemyCollision, checkPlayerCollectibleCollision } = useCollision();
  
  // Initialize game objects
  const initGame = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const currentLevel = levels.find(l => l.id === gameState.level);
    
    if (!currentLevel) return;
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Initialize game objects
    levelRef.current = new Level(canvas, gameState.level);
    playerRef.current = new Player(canvas, currentLevel.startPosition.x, currentLevel.startPosition.y);
    enemyRef.current = new Enemy(canvas, currentLevel.enemies);
    platformRef.current = new Platform(canvas, currentLevel.platforms);
    collectibleRef.current = new Collectible(canvas, currentLevel.collectibles);
    
    // Start the game
    setGameState(prev => ({ ...prev, status: "playing" }));
    
    console.log("Game initialized with level", gameState.level);
  }, [gameState.level, canvasRef]);
  
  // Set controls
  const setControls = useCallback((controls: Controls) => {
    controlsRef.current = controls;
  }, []);
  
  // Update game state
  const update = useCallback((deltaTime: number) => {
    if (gameState.status !== "playing") return;
    
    const player = playerRef.current;
    const level = levelRef.current;
    const enemy = enemyRef.current;
    const collectible = collectibleRef.current;
    
    if (!player || !level || !enemy || !collectible) return;
    
    // Update player
    player.update(deltaTime, controlsRef.current, 600); // gravity = 600
    
    // Update enemy
    enemy.update(deltaTime);
    
    // Update collectibles
    collectible.update(deltaTime);
    
    // Update camera to follow player
    level.updateCameraPosition(player.state.x);
    
    // Check if player reached the end of the level
    const currentLevel = levels.find(l => l.id === gameState.level);
    if (currentLevel && player.state.x >= currentLevel.finishPosition.x) {
      if (gameState.level < levels.length) {
        // Advance to next level
        setGameState(prev => ({
          ...prev,
          level: prev.level + 1,
          status: "win"
        }));
      } else {
        // Game completed
        setGameState(prev => ({
          ...prev,
          status: "win"
        }));
      }
    }
    
    // Check if player fell out of the world
    if (player.state.y > canvasRef.current?.height || player.state.y > 600) {
      handlePlayerDeath();
    }
  }, [gameState.status, gameState.level]);
  
  // Handle collisions
  const handleCollisions = useCallback(() => {
    if (gameState.status !== "playing") return { enemyHit: false, coinCollected: false };
    
    const player = playerRef.current;
    const level = levelRef.current;
    const enemy = enemyRef.current;
    const platform = platformRef.current;
    const collectible = collectibleRef.current;
    
    if (!player || !level || !enemy || !platform || !collectible) {
      return { enemyHit: false, coinCollected: false };
    }
    
    // Reset player grounded state
    player.state.isOnGround = false;
    
    // Platform collision
    const platformCollision = checkPlayerPlatformCollision(
      player.state, 
      platform.platforms
    );
    
    if (platformCollision.collided) {
      if (platformCollision.fromTop) {
        player.state.y = platformCollision.y - player.state.height;
        player.state.velocity.y = 0;
        player.state.isOnGround = true;
        player.state.isJumping = false;
      } else if (platformCollision.fromBottom) {
        player.state.y = platformCollision.y + platformCollision.height;
        player.state.velocity.y = 0;
      } else if (platformCollision.fromLeft) {
        player.state.x = platformCollision.x - player.state.width;
        player.state.velocity.x = 0;
      } else if (platformCollision.fromRight) {
        player.state.x = platformCollision.x + platformCollision.width;
        player.state.velocity.x = 0;
      }
    }
    
    // Enemy collision
    let enemyHit = false;
    const enemyCollisions = checkPlayerEnemyCollision(
      player.state, 
      enemy.getAliveEnemies()
    );
    
    if (enemyCollisions.length > 0) {
      enemyCollisions.forEach(collision => {
        if (collision.fromTop && player.state.velocity.y > 0) {
          // Bounce off enemy when stomping
          player.state.velocity.y = -300;
          enemy.killEnemy(collision.enemyId);
          
          // Add score for killing enemy
          setGameState(prev => ({
            ...prev,
            score: prev.score + 100
          }));
          
          enemyHit = true;
        } else {
          // Player hit by enemy
          handlePlayerDeath();
        }
      });
    }
    
    // Collectible collision
    let coinCollected = false;
    const collectibleCollisions = checkPlayerCollectibleCollision(
      player.state, 
      collectible.getActiveCollectibles()
    );
    
    if (collectibleCollisions.length > 0) {
      collectibleCollisions.forEach(collision => {
        const itemType = collectible.collectItem(collision.collectibleId);
        
        if (itemType === 'coin') {
          // Collect coin
          setGameState(prev => ({
            ...prev,
            score: prev.score + 50,
            coins: prev.coins + 1
          }));
          coinCollected = true;
        } else if (itemType === 'mushroom') {
          // Collect mushroom (power up - extra life)
          setGameState(prev => ({
            ...prev,
            score: prev.score + 200,
            lives: prev.lives + 1
          }));
        } else if (itemType === 'star') {
          // Collect star (power up - invincibility)
          setGameState(prev => ({
            ...prev,
            score: prev.score + 500
          }));
          // Could implement invincibility
        }
      });
    }
    
    return { enemyHit, coinCollected };
  }, [gameState.status, checkPlayerPlatformCollision, checkPlayerEnemyCollision, checkPlayerCollectibleCollision]);
  
  // Handle player death
  const handlePlayerDeath = useCallback(() => {
    setGameState(prev => {
      const newLives = prev.lives - 1;
      
      if (newLives <= 0) {
        return {
          ...prev,
          lives: 0,
          status: "game-over"
        };
      }
      
      return {
        ...prev,
        lives: newLives
      };
    });
    
    // Reset player position
    if (playerRef.current && levelRef.current) {
      const currentLevel = levels.find(l => l.id === gameState.level);
      if (currentLevel) {
        playerRef.current.reset(currentLevel.startPosition.x, currentLevel.startPosition.y);
      }
    }
  }, [gameState.level]);
  
  // Render game
  const render = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const level = levelRef.current;
    const player = playerRef.current;
    const enemy = enemyRef.current;
    const platform = platformRef.current;
    const collectible = collectibleRef.current;
    
    if (!level || !player || !enemy || !platform || !collectible) return;
    
    // Render level background
    level.render();
    
    // Render platforms
    platform.render(level.cameraOffset.x);
    
    // Render collectibles
    collectible.render(level.cameraOffset.x);
    
    // Render enemies
    enemy.render(level.cameraOffset.x);
    
    // Render player
    player.render(level.cameraOffset.x);
  }, []);
  
  // Reset game
  const resetGame = useCallback(() => {
    setGameState({
      status: "playing",
      score: 0,
      lives: 3,
      coins: 0,
      level: 1,
    });
    
    // Re-initialize game objects
    initGame();
  }, [initGame]);
  
  return {
    gameState,
    setControls,
    update,
    initGame,
    resetGame,
    handleCollisions,
    render,
  };
};

export default useGameState;
