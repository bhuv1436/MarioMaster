import { useCallback } from "react";
import { PlayerState } from "./Player";
import { PlatformData, EnemyData, CollectibleData } from "./Level";

interface CollisionResult {
  collided: boolean;
  fromTop: boolean;
  fromBottom: boolean;
  fromLeft: boolean;
  fromRight: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EnemyCollision {
  enemyId: string;
  fromTop: boolean;
}

interface CollectibleCollision {
  collectibleId: string;
}

const useCollision = () => {
  // Check if two rectangles are colliding (AABB collision detection)
  const isColliding = useCallback((rect1: any, rect2: any): boolean => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }, []);
  
  // Calculate which side the collision occurred from
  const getCollisionDirection = useCallback((
    player: PlayerState, 
    platform: { x: number; y: number; width: number; height: number }
  ): { top: boolean; bottom: boolean; left: boolean; right: boolean } => {
    // Calculate the center points
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const platformCenterX = platform.x + platform.width / 2;
    const platformCenterY = platform.y + platform.height / 2;
    
    // Calculate the overlap on both axes
    const overlapX = Math.min(player.x + player.width, platform.x + platform.width) - 
                     Math.max(player.x, platform.x);
    const overlapY = Math.min(player.y + player.height, platform.y + platform.height) - 
                     Math.max(player.y, platform.y);
    
    // Determine collision direction based on smaller overlap
    if (overlapX <= overlapY) {
      // Horizontal collision
      if (playerCenterX < platformCenterX) {
        return { left: false, right: true, top: false, bottom: false };
      } else {
        return { left: true, right: false, top: false, bottom: false };
      }
    } else {
      // Vertical collision
      if (playerCenterY < platformCenterY) {
        return { left: false, right: false, top: true, bottom: false };
      } else {
        return { left: false, right: false, top: false, bottom: true };
      }
    }
  }, []);
  
  // Check player collision with platforms
  const checkPlayerPlatformCollision = useCallback((
    player: PlayerState, 
    platforms: PlatformData[]
  ): CollisionResult => {
    const defaultResult: CollisionResult = {
      collided: false,
      fromTop: false,
      fromBottom: false,
      fromLeft: false,
      fromRight: false,
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    
    for (const platform of platforms) {
      if (isColliding(player, platform)) {
        const direction = getCollisionDirection(player, platform);
        
        return {
          collided: true,
          fromTop: direction.top,
          fromBottom: direction.bottom,
          fromLeft: direction.left,
          fromRight: direction.right,
          x: platform.x,
          y: platform.y,
          width: platform.width,
          height: platform.height
        };
      }
    }
    
    return defaultResult;
  }, [isColliding, getCollisionDirection]);
  
  // Check player collision with enemies
  const checkPlayerEnemyCollision = useCallback((
    player: PlayerState, 
    enemies: EnemyData[]
  ): EnemyCollision[] => {
    const collisions: EnemyCollision[] = [];
    
    for (const enemy of enemies) {
      if (isColliding(player, enemy)) {
        const direction = getCollisionDirection(player, enemy);
        
        // If player is falling onto enemy from above
        if (direction.top && player.velocity.y > 0) {
          collisions.push({
            enemyId: enemy.id,
            fromTop: true
          });
        } else {
          collisions.push({
            enemyId: enemy.id,
            fromTop: false
          });
        }
      }
    }
    
    return collisions;
  }, [isColliding, getCollisionDirection]);
  
  // Check player collision with collectibles
  const checkPlayerCollectibleCollision = useCallback((
    player: PlayerState, 
    collectibles: CollectibleData[]
  ): CollectibleCollision[] => {
    const collisions: CollectibleCollision[] = [];
    
    for (const collectible of collectibles) {
      if (isColliding(player, collectible)) {
        collisions.push({
          collectibleId: collectible.id
        });
      }
    }
    
    return collisions;
  }, [isColliding]);
  
  return {
    checkPlayerPlatformCollision,
    checkPlayerEnemyCollision,
    checkPlayerCollectibleCollision
  };
};

export default useCollision;
