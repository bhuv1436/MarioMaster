// Game constants
export const GRAVITY = 600; // Gravity strength
export const PLAYER_SPEED = 200; // Player movement speed
export const JUMP_FORCE = 400; // Jump strength
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 40;

// Collision constants
export const EDGE_BUFFER = 2; // Small buffer to detect edge collisions

// Game state constants
export enum GameStatus {
  READY = "ready",
  PLAYING = "playing",
  GAME_OVER = "game-over",
  WIN = "win"
}

// Control constants
export enum Controls {
  LEFT = "left",
  RIGHT = "right",
  JUMP = "jump"
}

// Asset keys for sprites
export enum SpriteKeys {
  PLAYER_IDLE = "player_idle",
  PLAYER_RUN = "player_run",
  PLAYER_JUMP = "player_jump",
  ENEMY_GOOMBA = "enemy_goomba",
  ENEMY_KOOPA = "enemy_koopa",
  COLLECTIBLE_COIN = "collectible_coin",
  COLLECTIBLE_MUSHROOM = "collectible_mushroom",
  COLLECTIBLE_STAR = "collectible_star",
  PLATFORM_GROUND = "platform_ground",
  PLATFORM_BRICK = "platform_brick",
  PLATFORM_QUESTION = "platform_question",
  PLATFORM_PIPE = "platform_pipe"
}

// Sound keys
export enum SoundKeys {
  JUMP = "jump",
  COIN = "coin",
  POWERUP = "powerup",
  ENEMY_HIT = "enemy_hit",
  PLAYER_DEATH = "player_death",
  BACKGROUND_MUSIC = "background_music"
}

// Animation constants
export const ANIMATION_SPEED = 0.15; // Frames per second
export const FRAMES_PER_ROW = 4; // Number of frames in each sprite row
