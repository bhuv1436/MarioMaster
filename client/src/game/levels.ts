import { LevelData } from "./Level";

export const levels: LevelData[] = [
  {
    id: 1,
    platforms: [
      { id: "ground1", x: 0, y: 550, width: 800, height: 50, type: "ground" },
      { id: "ground2", x: 850, y: 550, width: 800, height: 50, type: "ground" },
      { id: "ground3", x: 1700, y: 550, width: 800, height: 50, type: "ground" },
      
      // Platforms
      { id: "platform1", x: 300, y: 450, width: 100, height: 20, type: "brick" },
      { id: "platform2", x: 450, y: 400, width: 100, height: 20, type: "brick" },
      { id: "platform3", x: 600, y: 350, width: 100, height: 20, type: "brick" },
      
      // Question blocks with items
      { id: "question1", x: 350, y: 350, width: 40, height: 40, type: "question", containsItem: "coin" },
      { id: "question2", x: 500, y: 300, width: 40, height: 40, type: "question", containsItem: "mushroom" },
      { id: "question3", x: 550, y: 300, width: 40, height: 40, type: "question", containsItem: "coin" },
      { id: "question4", x: 600, y: 300, width: 40, height: 40, type: "question", containsItem: "star" },
      
      // Pipes
      { id: "pipe1", x: 900, y: 480, width: 60, height: 70, type: "pipe" },
      { id: "pipe2", x: 1200, y: 450, width: 60, height: 100, type: "pipe" },
      
      // Floating platforms
      { id: "platform4", x: 1000, y: 400, width: 150, height: 20, type: "brick" },
      { id: "platform5", x: 1300, y: 350, width: 150, height: 20, type: "brick" },
      { id: "platform6", x: 1500, y: 400, width: 150, height: 20, type: "brick" },
      { id: "platform7", x: 1800, y: 450, width: 150, height: 20, type: "brick" },
      { id: "platform8", x: 2000, y: 400, width: 150, height: 20, type: "brick" },
      
      // Breakable brick blocks
      { id: "brick1", x: 400, y: 350, width: 40, height: 40, type: "brick", containsItem: "coin" },
      { id: "brick2", x: 450, y: 350, width: 40, height: 40, type: "brick" },
      { id: "brick3", x: 500, y: 350, width: 40, height: 40, type: "brick" },
      
      { id: "brick4", x: 1100, y: 300, width: 40, height: 40, type: "brick", containsItem: "coin" },
      { id: "brick5", x: 1150, y: 300, width: 40, height: 40, type: "brick", containsItem: "coin" },
      { id: "brick6", x: 1200, y: 300, width: 40, height: 40, type: "brick" },
    ],
    enemies: [
      // Goombas
      { 
        id: "goomba1", 
        x: 400, 
        y: 510, 
        width: 40, 
        height: 40, 
        type: "goomba", 
        speed: 50, 
        direction: -1,
        range: { min: 300, max: 600 } 
      },
      { 
        id: "goomba2", 
        x: 700, 
        y: 510, 
        width: 40, 
        height: 40, 
        type: "goomba", 
        speed: 50, 
        direction: -1,
        range: { min: 600, max: 900 } 
      },
      
      // Koopas
      { 
        id: "koopa1", 
        x: 1100, 
        y: 510, 
        width: 40, 
        height: 40, 
        type: "koopa", 
        speed: 70, 
        direction: -1,
        range: { min: 950, max: 1150 } 
      },
      { 
        id: "koopa2", 
        x: 1600, 
        y: 510, 
        width: 40, 
        height: 40, 
        type: "koopa", 
        speed: 70, 
        direction: 1,
        range: { min: 1500, max: 1700 } 
      },
      
      // Platform enemies
      { 
        id: "goomba3", 
        x: 1050, 
        y: 360, 
        width: 40, 
        height: 40, 
        type: "goomba", 
        speed: 40, 
        direction: -1,
        range: { min: 1000, max: 1150 } 
      },
    ],
    collectibles: [
      // Coins
      { id: "coin1", x: 300, y: 500, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin2", x: 350, y: 500, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin3", x: 400, y: 500, width: 30, height: 30, type: "coin", collected: false },
      
      { id: "coin4", x: 350, y: 310, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin5", x: 500, y: 260, width: 30, height: 30, type: "coin", collected: false },
      
      { id: "coin6", x: 1050, y: 360, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin7", x: 1080, y: 360, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin8", x: 1350, y: 310, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin9", x: 1380, y: 310, width: 30, height: 30, type: "coin", collected: false },
      
      // Power-ups
      { id: "mushroom1", x: 350, y: 300, width: 40, height: 40, type: "mushroom", collected: false },
      { id: "star1", x: 1850, y: 410, width: 40, height: 40, type: "star", collected: false },
    ],
    background: "sky",
    width: 2400,
    height: 600,
    startPosition: { x: 50, y: 450 },
    finishPosition: { x: 2300, y: 450 }
  },
  {
    id: 2,
    platforms: [
      // Main ground
      { id: "ground1", x: 0, y: 550, width: 900, height: 50, type: "ground" },
      { id: "ground2", x: 1050, y: 550, width: 900, height: 50, type: "ground" },
      { id: "ground3", x: 2100, y: 550, width: 900, height: 50, type: "ground" },
      
      // Gap platforms
      { id: "bridge1", x: 950, y: 500, width: 50, height: 10, type: "brick" },
      { id: "bridge2", x: 2050, y: 500, width: 50, height: 10, type: "brick" },
      
      // Stepped platforms
      { id: "step1", x: 300, y: 500, width: 100, height: 50, type: "brick" },
      { id: "step2", x: 400, y: 450, width: 100, height: 100, type: "brick" },
      { id: "step3", x: 500, y: 400, width: 100, height: 150, type: "brick" },
      
      // Floating platforms
      { id: "float1", x: 700, y: 400, width: 150, height: 20, type: "brick" },
      { id: "float2", x: 1200, y: 350, width: 150, height: 20, type: "brick" },
      { id: "float3", x: 1500, y: 300, width: 150, height: 20, type: "brick" },
      { id: "float4", x: 1800, y: 350, width: 150, height: 20, type: "brick" },
      
      // Question blocks with items
      { id: "q1", x: 750, y: 300, width: 40, height: 40, type: "question", containsItem: "coin" },
      { id: "q2", x: 1250, y: 250, width: 40, height: 40, type: "question", containsItem: "mushroom" },
      { id: "q3", x: 1550, y: 200, width: 40, height: 40, type: "question", containsItem: "star" },
      { id: "q4", x: 1600, y: 200, width: 40, height: 40, type: "question", containsItem: "coin" },
      
      // Pipes
      { id: "pipe1", x: 1400, y: 480, width: 60, height: 70, type: "pipe" },
      { id: "pipe2", x: 2300, y: 480, width: 60, height: 70, type: "pipe" },
      
      // Breakable brick blocks
      { id: "brick1", x: 800, y: 300, width: 40, height: 40, type: "brick" },
      { id: "brick2", x: 850, y: 300, width: 40, height: 40, type: "brick", containsItem: "coin" },
      
      { id: "brick3", x: 1300, y: 250, width: 40, height: 40, type: "brick" },
      { id: "brick4", x: 1350, y: 250, width: 40, height: 40, type: "brick", containsItem: "coin" },
      
      { id: "brick5", x: 1850, y: 250, width: 40, height: 40, type: "brick" },
      { id: "brick6", x: 1900, y: 250, width: 40, height: 40, type: "brick", containsItem: "coin" },
      { id: "brick7", x: 1950, y: 250, width: 40, height: 40, type: "brick" },
    ],
    enemies: [
      // Ground enemies
      { 
        id: "goomba1", 
        x: 350, 
        y: 460, 
        width: 40, 
        height: 40, 
        type: "goomba", 
        speed: 60, 
        direction: -1,
        range: { min: 300, max: 400 } 
      },
      { 
        id: "koopa1", 
        x: 600, 
        y: 360, 
        width: 40, 
        height: 40, 
        type: "koopa", 
        speed: 40, 
        direction: -1,
        range: { min: 520, max: 680 } 
      },
      { 
        id: "goomba2", 
        x: 1300, 
        y: 510, 
        width: 40, 
        height: 40, 
        type: "goomba", 
        speed: 80, 
        direction: 1,
        range: { min: 1100, max: 1380 } 
      },
      { 
        id: "koopa2", 
        x: 1600, 
        y: 510, 
        width: 40, 
        height: 40, 
        type: "koopa", 
        speed: 90, 
        direction: -1,
        range: { min: 1500, max: 1700 } 
      },
      
      // Platform enemies
      { 
        id: "goomba3", 
        x: 1250, 
        y: 310, 
        width: 40, 
        height: 40, 
        type: "goomba", 
        speed: 30, 
        direction: -1,
        range: { min: 1200, max: 1350 } 
      },
      { 
        id: "goomba4", 
        x: 1850, 
        y: 310, 
        width: 40, 
        height: 40, 
        type: "goomba", 
        speed: 30, 
        direction: 1,
        range: { min: 1800, max: 1950 } 
      },
    ],
    collectibles: [
      // Coins
      { id: "coin1", x: 300, y: 450, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin2", x: 400, y: 400, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin3", x: 500, y: 350, width: 30, height: 30, type: "coin", collected: false },
      
      { id: "coin4", x: 750, y: 260, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin5", x: 780, y: 260, width: 30, height: 30, type: "coin", collected: false },
      
      { id: "coin6", x: 900, y: 450, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin7", x: 950, y: 450, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin8", x: 1000, y: 450, width: 30, height: 30, type: "coin", collected: false },
      
      { id: "coin9", x: 1200, y: 310, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin10", x: 1230, y: 310, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin11", x: 1260, y: 310, width: 30, height: 30, type: "coin", collected: false },
      
      { id: "coin12", x: 1500, y: 260, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin13", x: 1530, y: 260, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin14", x: 1560, y: 260, width: 30, height: 30, type: "coin", collected: false },
      { id: "coin15", x: 1590, y: 260, width: 30, height: 30, type: "coin", collected: false },
      
      // Power-ups
      { id: "mushroom1", x: 750, y: 240, width: 40, height: 40, type: "mushroom", collected: false },
      { id: "star1", x: 1250, y: 210, width: 40, height: 40, type: "star", collected: false },
    ],
    background: "sky",
    width: 3000,
    height: 600,
    startPosition: { x: 50, y: 450 },
    finishPosition: { x: 2900, y: 450 }
  }
];
