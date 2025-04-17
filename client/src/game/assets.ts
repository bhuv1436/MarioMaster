// This file handles asset loading and management

// Pre-define SVG sprites as data URLs
export const sprites = {
  player: {
    idle: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="32" viewBox="0 0 128 32"><rect x="0" y="0" width="32" height="32" fill="red"/><rect x="32" y="0" width="32" height="32" fill="red"/><rect x="64" y="0" width="32" height="32" fill="red"/><rect x="96" y="0" width="32" height="32" fill="red"/></svg>`,
    run: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="32" viewBox="0 0 128 32"><rect x="0" y="0" width="32" height="32" fill="red"/><rect x="32" y="0" width="32" height="32" fill="red"/><rect x="64" y="0" width="32" height="32" fill="red"/><rect x="96" y="0" width="32" height="32" fill="red"/></svg>`,
    jump: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="0" y="0" width="32" height="32" fill="red"/></svg>`,
  },
  enemies: {
    goomba: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" viewBox="0 0 64 32"><rect x="0" y="0" width="32" height="32" fill="brown"/><rect x="32" y="0" width="32" height="32" fill="brown"/></svg>`,
    koopa: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" viewBox="0 0 64 32"><rect x="0" y="0" width="32" height="32" fill="green"/><rect x="32" y="0" width="32" height="32" fill="green"/></svg>`,
  },
  collectibles: {
    coin: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="32" viewBox="0 0 128 32"><circle cx="16" cy="16" r="14" fill="gold" stroke="black" stroke-width="2"/><circle cx="48" cy="16" r="12" fill="gold" stroke="black" stroke-width="2"/><circle cx="80" cy="16" r="10" fill="gold" stroke="black" stroke-width="2"/><circle cx="112" cy="16" r="14" fill="gold" stroke="black" stroke-width="2"/></svg>`,
    mushroom: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="8" y="16" width="16" height="16" fill="red"/><circle cx="16" cy="16" r="12" fill="red" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="white"/><circle cx="20" cy="12" r="3" fill="white"/></svg>`,
    star: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><polygon points="16,2 20,12 30,12 22,18 25,28 16,22 7,28 10,18 2,12 12,12" fill="yellow" stroke="black" stroke-width="1"/></svg>`,
  },
  platforms: {
    ground: '/textures/grass.png',
    brick: '/textures/wood.jpg',
    question: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="0" y="0" width="32" height="32" fill="gold" stroke="black" stroke-width="2"/><text x="13" y="24" font-family="Arial" font-size="24" fill="black">?</text></svg>`,
    pipe: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="0" y="0" width="32" height="32" fill="green" stroke="black" stroke-width="2"/><rect x="4" y="4" width="24" height="8" fill="black"/></svg>`,
  }
};

// Preload images
const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Load all assets
export const loadAssets = async () => {
  try {
    const assets: Record<string, any> = {};
    
    // Preload player sprites
    assets.player = {};
    for (const [key, src] of Object.entries(sprites.player)) {
      assets.player[key] = await preloadImage(src);
    }
    
    // Preload enemy sprites
    assets.enemies = {};
    for (const [key, src] of Object.entries(sprites.enemies)) {
      assets.enemies[key] = await preloadImage(src);
    }
    
    // Preload collectible sprites
    assets.collectibles = {};
    for (const [key, src] of Object.entries(sprites.collectibles)) {
      assets.collectibles[key] = await preloadImage(src);
    }
    
    // Preload platform sprites
    assets.platforms = {};
    for (const [key, src] of Object.entries(sprites.platforms)) {
      assets.platforms[key] = await preloadImage(src);
    }
    
    return assets;
  } catch (error) {
    console.error('Error loading assets:', error);
    throw error;
  }
};
