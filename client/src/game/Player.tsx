import { useEffect, useRef } from "react";
import { sprites } from "./assets";

export type PlayerSize = 'small' | 'big';
export type PlayerPowerup = 'none' | 'fire' | 'star';

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: {
    x: number;
    y: number;
  };
  isJumping: boolean;
  isOnGround: boolean;
  direction: 'left' | 'right';
  frame: number;
  animationTimer: number;
  spriteSheet: HTMLImageElement | null;
  
  // Mario specific states
  size: PlayerSize;
  powerup: PlayerPowerup;
  isInvincible: boolean;
  invincibilityTimer: number;
  isBlinking: boolean;
  blinkTimer: number;
  jumpHoldTimer: number; // For variable jump heights
  starTimer: number; // For star power duration
  isRunning: boolean;
  isSkidding: boolean; // When changing direction quickly
}

class Player {
  state: PlayerState;
  ctx: CanvasRenderingContext2D;
  cameraOffset: { x: number; y: number };
  canvas: HTMLCanvasElement;
  spriteImg: HTMLImageElement;
  frameWidth: number = 32; // Width of each sprite frame
  frameHeight: number = 32; // Height of each sprite frame
  animationSpeed: number = 0.15; // Frames per second
  
  constructor(canvas: HTMLCanvasElement, startX: number, startY: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.cameraOffset = { x: 0, y: 0 };
    
    // Setup sprite
    this.spriteImg = new Image();
    // Using a simpler asset for the sprite - we'll create this with SVG
    this.spriteImg.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="32" viewBox="0 0 128 32"><rect x="0" y="0" width="32" height="32" fill="red"/><rect x="32" y="0" width="32" height="32" fill="red"/><rect x="64" y="0" width="32" height="32" fill="red"/><rect x="96" y="0" width="32" height="32" fill="red"/></svg>`;
    
    this.state = {
      x: startX,
      y: startY,
      width: 40,
      height: 40,
      velocity: {
        x: 0,
        y: 0,
      },
      isJumping: false,
      isOnGround: false,
      direction: 'right',
      frame: 0,
      animationTimer: 0,
      spriteSheet: null,
      
      // Mario specific states initialized
      size: 'small',
      powerup: 'none',
      isInvincible: false,
      invincibilityTimer: 0,
      isBlinking: false,
      blinkTimer: 0,
      jumpHoldTimer: 0,
      starTimer: 0,
      isRunning: false,
      isSkidding: false
    };
    
    // Initialize global player size property for other components to use
    (window as any).playerSize = 'small';
    
    // Load sprite image
    this.loadSprite();
  }
  
  loadSprite() {
    const img = new Image();
    img.onload = () => {
      this.state.spriteSheet = img;
    };
    
    // Use the Mario sprite from assets
    if (this.state.size === 'small') {
      img.src = this.state.isJumping 
        ? sprites.player.jump 
        : (Math.abs(this.state.velocity.x) > 10 ? sprites.player.run : sprites.player.idle);
    } else {
      // Use big Mario sprite when powered up
      img.src = sprites.player.big_idle;
    }
  }
  
  // Get sprite based on current state
  getSpriteForState() {
    if (this.state.powerup === 'star') {
      // Show flashing sprite for star power
      return this.state.frame % 2 === 0 ? sprites.player.idle : sprites.player.run;
    }
    
    if (this.state.size === 'big') {
      return sprites.player.big_idle;
    }
    
    if (this.state.isJumping) {
      return sprites.player.jump;
    }
    
    if (this.state.isSkidding) {
      return sprites.player.idle; // Could use a skidding sprite
    }
    
    if (Math.abs(this.state.velocity.x) > 10) {
      return sprites.player.run;
    }
    
    return sprites.player.idle;
  }
  
  update(deltaTime: number, controls: { left: boolean, right: boolean, jump: boolean }, gravity: number) {
    // Update physics
    const { state } = this;
    
    // Check for running state
    state.isRunning = Math.abs(state.velocity.x) > 150;
    
    // Update invincibility timers
    if (state.isInvincible) {
      state.invincibilityTimer -= deltaTime;
      state.blinkTimer -= deltaTime;
      
      // Toggle blinking state for visual feedback
      if (state.blinkTimer <= 0) {
        state.isBlinking = !state.isBlinking;
        state.blinkTimer = 0.1; // Blink every 100ms
      }
      
      // End invincibility when timer expires
      if (state.invincibilityTimer <= 0) {
        state.isInvincible = false;
      }
    }
    
    // Update star power timer
    if (state.powerup === 'star') {
      state.starTimer -= deltaTime;
      if (state.starTimer <= 0) {
        state.powerup = 'none';
        state.isInvincible = false;
      }
    }
    
    // Handle left/right movement - Mario style physics
    const maxSpeed = state.isRunning ? 300 : 200;
    const acceleration = 800;
    const deceleration = 0.85;
    
    // Check for direction change to trigger skidding
    if ((controls.left && state.velocity.x > 50) || 
        (controls.right && state.velocity.x < -50)) {
      state.isSkidding = true;
    } else {
      state.isSkidding = false;
    }
    
    // Handle left/right movement with acceleration
    if (controls.left) {
      // Apply acceleration in the left direction
      state.velocity.x = Math.max(state.velocity.x - acceleration * deltaTime, -maxSpeed);
      state.direction = 'left';
    } else if (controls.right) {
      // Apply acceleration in the right direction
      state.velocity.x = Math.min(state.velocity.x + acceleration * deltaTime, maxSpeed);
      state.direction = 'right';
    } else {
      // Apply deceleration/friction when no input
      state.velocity.x *= deceleration;
      if (Math.abs(state.velocity.x) < 5) state.velocity.x = 0;
    }
    
    // Handle variable height jumping - the Mario signature feel
    if (controls.jump) {
      // Initial jump
      if (state.isOnGround && !state.isJumping) {
        state.velocity.y = state.size === 'big' ? -450 : -400; // Jump velocity
        state.isJumping = true;
        state.isOnGround = false;
        state.jumpHoldTimer = 0.25; // Max time jump can be held
      } 
      // Continued jump height while holding the button (lower gravity while ascending)
      else if (state.isJumping && state.jumpHoldTimer > 0 && state.velocity.y < 0) {
        gravity *= 0.6; // Reduce gravity while holding jump during ascent
      }
    } else {
      // When jump released, immediately end the variable height jump
      state.jumpHoldTimer = 0;
    }
    
    // Update jump timer
    if (state.jumpHoldTimer > 0) {
      state.jumpHoldTimer -= deltaTime;
    }
    
    // Apply gravity
    state.velocity.y += gravity * deltaTime;
    
    // Cap max falling speed
    if (state.velocity.y > 600) {
      state.velocity.y = 600;
    }
    
    // Update position
    state.x += state.velocity.x * deltaTime;
    state.y += state.velocity.y * deltaTime;
    
    // Update animation
    if (state.isJumping) {
      // Use jump frame
      state.frame = 0;
    } else if (Math.abs(state.velocity.x) > 10) {
      // Running animation
      const animSpeed = state.isRunning ? 0.1 : 0.15;
      state.animationTimer += deltaTime;
      if (state.animationTimer >= animSpeed) {
        state.frame = (state.frame + 1) % 4; // 4 frames in the spritesheet
        state.animationTimer = 0;
      }
    } else {
      // Reset to standing frame when not moving
      state.frame = 0;
    }
    
    // Make sure player doesn't go off-screen to the left
    if (state.x < 0) {
      state.x = 0;
      state.velocity.x = 0;
    }
    
    // Update sprite based on current state
    this.loadSprite();
  }
  
  render(cameraOffsetX: number) {
    const { state, ctx } = this;
    
    // Convert world coordinates to screen coordinates
    const screenX = state.x - cameraOffsetX;
    
    // Skip rendering if player is blinking during invincibility frames
    if (state.isInvincible && state.isBlinking) {
      return;
    }
    
    // Apply star power visual effect (flickering/glowing)
    if (state.powerup === 'star') {
      ctx.save();
      
      // Add glow effect
      const glowColors = ['#FFD700', '#FFA500', '#FF4500', '#FF0000'];
      const glowColor = glowColors[Math.floor(state.frame) % glowColors.length];
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10;
    }
    
    if (state.spriteSheet) {
      // Draw sprite from spritesheet
      ctx.save();
      
      // Determine frame height based on size
      const renderHeight = state.size === 'big' ? state.height * 1.5 : state.height;
      const renderY = state.size === 'big' ? state.y - state.height * 0.5 : state.y;
      
      if (state.direction === 'left') {
        // Flip horizontally if facing left
        ctx.scale(-1, 1);
        ctx.drawImage(
          state.spriteSheet,
          state.frame * this.frameWidth, 0, 
          this.frameWidth, this.frameHeight,
          -screenX - state.width, renderY, 
          state.width, renderHeight
        );
      } else {
        // Normal drawing if facing right
        ctx.drawImage(
          state.spriteSheet,
          state.frame * this.frameWidth, 0, 
          this.frameWidth, this.frameHeight,
          screenX, renderY, 
          state.width, renderHeight
        );
      }
      
      ctx.restore();
    } else {
      // Fallback drawing if spritesheet isn't loaded
      ctx.fillStyle = state.powerup === 'star' 
        ? `hsl(${(Date.now() % 1000) / 1000 * 360}, 100%, 50%)` // Rainbow effect for star power
        : (state.size === 'big' ? '#FF6666' : '#FF0000');        // Different red for big/small
      
      const renderHeight = state.size === 'big' ? state.height * 1.5 : state.height;
      const renderY = state.size === 'big' ? state.y - state.height * 0.5 : state.y;
      
      ctx.fillRect(screenX, renderY, state.width, renderHeight);
    }
    
    // Restore context if we had star power effects
    if (state.powerup === 'star') {
      ctx.restore();
    }
    
    // Skip drawing eyes/mouth if we have proper sprites
    if (!state.spriteSheet) {
      // Draw a face on the character for better visibility
      ctx.fillStyle = 'black';
      if (state.direction === 'right') {
        // Eyes
        ctx.fillRect(screenX + state.width - 15, state.y + 10, 4, 4);
        ctx.fillRect(screenX + state.width - 25, state.y + 10, 4, 4);
        // Mouth
        ctx.fillRect(screenX + state.width - 25, state.y + 20, 14, 2);
      } else {
        // Eyes for left direction
        ctx.fillRect(screenX + 15, state.y + 10, 4, 4);
        ctx.fillRect(screenX + 25, state.y + 10, 4, 4);
        // Mouth
        ctx.fillRect(screenX + 11, state.y + 20, 14, 2);
      }
    }
  }
  
  reset(startX: number, startY: number) {
    this.state.x = startX;
    this.state.y = startY;
    this.state.velocity.x = 0;
    this.state.velocity.y = 0;
    this.state.isJumping = false;
    this.state.isOnGround = false;
    this.state.direction = 'right';
    this.state.frame = 0;
    this.state.animationTimer = 0;
    
    // Reset size only when starting from the beginning
    // For level restart after death, we should reset to small
    if (startX === 50) { // Starting position check
      this.state.size = 'small';
      this.state.height = 40;
      // Update global player size
      (window as any).playerSize = 'small';
    }
    
    // Reset power-up state
    this.state.powerup = 'none';
    this.state.isInvincible = true; // Brief invincibility after reset
    this.state.invincibilityTimer = 3.0; // 3 seconds of invincibility
    this.state.isBlinking = false;
    this.state.blinkTimer = 0.1;
    this.state.jumpHoldTimer = 0;
    this.state.starTimer = 0;
    this.state.isRunning = false;
    this.state.isSkidding = false;
  }
  
  // Power the player up with a mushroom
  powerUp() {
    if (this.state.size === 'small') {
      this.state.size = 'big';
      this.state.height = 80; // Double height for big Mario
      // Adjust y position to account for height increase
      this.state.y -= 40;
      
      // Set global size property for other components to check
      (window as any).playerSize = 'big';
    }
  }
  
  // Give the player star power
  activateStarPower() {
    this.state.powerup = 'star';
    this.state.isInvincible = true;
    this.state.starTimer = 10.0; // 10 seconds of star power
  }
  
  // Handle the player taking damage
  takeDamage() {
    if (this.state.isInvincible) {
      return false; // No damage during invincibility
    }
    
    if (this.state.size === 'big') {
      // Downgrade to small Mario
      this.state.size = 'small';
      this.state.height = 40;
      this.state.isInvincible = true;
      this.state.invincibilityTimer = 2.0; // Brief invincibility
      
      // Update global size property
      (window as any).playerSize = 'small';
      
      return false; // Didn't die
    } else {
      // Small Mario dies
      return true; // Died
    }
  }
}

export default Player;
