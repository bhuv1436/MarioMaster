// This file handles asset loading and management

// Pre-define SVG sprites as data URLs
export const sprites = {
  player: {
    // Mario idle animation frames (4 frames)
    idle: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="32" viewBox="0 0 128 32">
      <!-- Frame 1 -->
      <g transform="translate(0,0)">
        <rect x="8" y="0" width="16" height="8" fill="%23ff0000"/>
        <rect x="4" y="8" width="24" height="8" fill="%23ff0000"/>
        <rect x="4" y="16" width="24" height="16" fill="%230000aa"/>
        <rect x="4" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="20" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="4" y="24" width="8" height="8" fill="%23aa5500"/>
        <rect x="20" y="24" width="8" height="8" fill="%23aa5500"/>
      </g>
      <!-- Frame 2 -->
      <g transform="translate(32,0)">
        <rect x="8" y="0" width="16" height="8" fill="%23ff0000"/>
        <rect x="4" y="8" width="24" height="8" fill="%23ff0000"/>
        <rect x="4" y="16" width="24" height="16" fill="%230000aa"/>
        <rect x="4" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="20" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="4" y="24" width="8" height="8" fill="%23aa5500"/>
        <rect x="20" y="24" width="8" height="8" fill="%23aa5500"/>
      </g>
      <!-- Frame 3 -->
      <g transform="translate(64,0)">
        <rect x="8" y="0" width="16" height="8" fill="%23ff0000"/>
        <rect x="4" y="8" width="24" height="8" fill="%23ff0000"/>
        <rect x="4" y="16" width="24" height="16" fill="%230000aa"/>
        <rect x="4" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="20" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="4" y="24" width="8" height="8" fill="%23aa5500"/>
        <rect x="20" y="24" width="8" height="8" fill="%23aa5500"/>
      </g>
      <!-- Frame 4 -->
      <g transform="translate(96,0)">
        <rect x="8" y="0" width="16" height="8" fill="%23ff0000"/>
        <rect x="4" y="8" width="24" height="8" fill="%23ff0000"/>
        <rect x="4" y="16" width="24" height="16" fill="%230000aa"/>
        <rect x="4" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="20" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="4" y="24" width="8" height="8" fill="%23aa5500"/>
        <rect x="20" y="24" width="8" height="8" fill="%23aa5500"/>
      </g>
    </svg>`,
    
    // Mario running animation frames (4 frames)
    run: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="32" viewBox="0 0 128 32">
      <!-- Frame 1: Starting run -->
      <g transform="translate(0,0)">
        <rect x="8" y="0" width="16" height="8" fill="%23ff0000"/>
        <rect x="4" y="8" width="24" height="8" fill="%23ff0000"/>
        <rect x="4" y="16" width="24" height="12" fill="%230000aa"/>
        <rect x="4" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="20" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="12" y="28" width="8" height="4" fill="%23aa5500"/>
        <rect x="4" y="24" width="8" height="8" fill="%23aa5500"/>
      </g>
      <!-- Frame 2: Mid-run -->
      <g transform="translate(32,0)">
        <rect x="8" y="0" width="16" height="8" fill="%23ff0000"/>
        <rect x="4" y="8" width="24" height="8" fill="%23ff0000"/>
        <rect x="4" y="16" width="24" height="8" fill="%230000aa"/>
        <rect x="4" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="20" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="8" y="24" width="8" height="8" fill="%23aa5500"/>
        <rect x="20" y="24" width="8" height="8" fill="%23aa5500"/>
      </g>
      <!-- Frame 3: Full stride -->
      <g transform="translate(64,0)">
        <rect x="8" y="0" width="16" height="8" fill="%23ff0000"/>
        <rect x="4" y="8" width="24" height="8" fill="%23ff0000"/>
        <rect x="4" y="16" width="24" height="12" fill="%230000aa"/>
        <rect x="4" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="20" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="20" y="28" width="8" height="4" fill="%23aa5500"/>
        <rect x="20" y="24" width="8" height="8" fill="%23aa5500"/>
      </g>
      <!-- Frame 4: Return to center -->
      <g transform="translate(96,0)">
        <rect x="8" y="0" width="16" height="8" fill="%23ff0000"/>
        <rect x="4" y="8" width="24" height="8" fill="%23ff0000"/>
        <rect x="4" y="16" width="24" height="8" fill="%230000aa"/>
        <rect x="4" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="20" y="16" width="8" height="8" fill="%23ffaa00"/>
        <rect x="4" y="24" width="8" height="8" fill="%23aa5500"/>
        <rect x="20" y="24" width="8" height="8" fill="%23aa5500"/>
      </g>
    </svg>`,
    
    // Mario jumping frame
    jump: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="8" y="0" width="16" height="8" fill="%23ff0000"/>
      <rect x="4" y="8" width="24" height="8" fill="%23ff0000"/>
      <rect x="4" y="16" width="24" height="10" fill="%230000aa"/>
      <rect x="4" y="16" width="8" height="8" fill="%23ffaa00"/>
      <rect x="20" y="16" width="8" height="8" fill="%23ffaa00"/>
      <rect x="12" y="26" width="8" height="6" fill="%23aa5500"/>
    </svg>`,
    
    // Big Mario after mushroom
    big_idle: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="64" viewBox="0 0 128 64">
      <!-- Frame 1 -->
      <g transform="translate(0,0)">
        <rect x="8" y="0" width="16" height="8" fill="%23ff0000"/>
        <rect x="4" y="8" width="24" height="8" fill="%23ff0000"/>
        <rect x="4" y="16" width="24" height="32" fill="%230000aa"/>
        <rect x="4" y="16" width="8" height="16" fill="%23ffaa00"/>
        <rect x="20" y="16" width="8" height="16" fill="%23ffaa00"/>
        <rect x="4" y="48" width="8" height="16" fill="%23aa5500"/>
        <rect x="20" y="48" width="8" height="16" fill="%23aa5500"/>
      </g>
      <!-- Repeat for other frames -->
      <g transform="translate(32,0)">
        <rect x="8" y="0" width="16" height="8" fill="%23ff0000"/>
        <rect x="4" y="8" width="24" height="8" fill="%23ff0000"/>
        <rect x="4" y="16" width="24" height="32" fill="%230000aa"/>
        <rect x="4" y="16" width="8" height="16" fill="%23ffaa00"/>
        <rect x="20" y="16" width="8" height="16" fill="%23ffaa00"/>
        <rect x="4" y="48" width="8" height="16" fill="%23aa5500"/>
        <rect x="20" y="48" width="8" height="16" fill="%23aa5500"/>
      </g>
      <g transform="translate(64,0)">
        <rect x="8" y="0" width="16" height="8" fill="%23ff0000"/>
        <rect x="4" y="8" width="24" height="8" fill="%23ff0000"/>
        <rect x="4" y="16" width="24" height="32" fill="%230000aa"/>
        <rect x="4" y="16" width="8" height="16" fill="%23ffaa00"/>
        <rect x="20" y="16" width="8" height="16" fill="%23ffaa00"/>
        <rect x="4" y="48" width="8" height="16" fill="%23aa5500"/>
        <rect x="20" y="48" width="8" height="16" fill="%23aa5500"/>
      </g>
      <g transform="translate(96,0)">
        <rect x="8" y="0" width="16" height="8" fill="%23ff0000"/>
        <rect x="4" y="8" width="24" height="8" fill="%23ff0000"/>
        <rect x="4" y="16" width="24" height="32" fill="%230000aa"/>
        <rect x="4" y="16" width="8" height="16" fill="%23ffaa00"/>
        <rect x="20" y="16" width="8" height="16" fill="%23ffaa00"/>
        <rect x="4" y="48" width="8" height="16" fill="%23aa5500"/>
        <rect x="20" y="48" width="8" height="16" fill="%23aa5500"/>
      </g>
    </svg>`,
  },
  enemies: {
    // Goomba animation frames (2 frames)
    goomba: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" viewBox="0 0 64 32">
      <!-- Frame 1 -->
      <g transform="translate(0,0)">
        <rect x="6" y="0" width="20" height="16" fill="%23993300"/>
        <rect x="4" y="16" width="24" height="8" fill="%23693200"/>
        <rect x="0" y="24" width="12" height="8" fill="%23000000"/>
        <rect x="20" y="24" width="12" height="8" fill="%23000000"/>
        <circle cx="10" cy="8" r="3" fill="%23FFFFFF"/>
        <circle cx="22" cy="8" r="3" fill="%23FFFFFF"/>
        <circle cx="10" cy="8" r="1" fill="%23000000"/>
        <circle cx="22" cy="8" r="1" fill="%23000000"/>
      </g>
      <!-- Frame 2 -->
      <g transform="translate(32,0)">
        <rect x="6" y="0" width="20" height="16" fill="%23993300"/>
        <rect x="4" y="16" width="24" height="8" fill="%23693200"/>
        <rect x="2" y="24" width="10" height="8" fill="%23000000"/>
        <rect x="20" y="24" width="10" height="8" fill="%23000000"/>
        <circle cx="10" cy="8" r="3" fill="%23FFFFFF"/>
        <circle cx="22" cy="8" r="3" fill="%23FFFFFF"/>
        <circle cx="10" cy="8" r="1" fill="%23000000"/>
        <circle cx="22" cy="8" r="1" fill="%23000000"/>
      </g>
    </svg>`,
    
    // Koopa Troopa animation frames (2 frames)
    koopa: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" viewBox="0 0 64 32">
      <!-- Frame 1 -->
      <g transform="translate(0,0)">
        <rect x="8" y="0" width="16" height="12" fill="%23009900"/>
        <rect x="4" y="12" width="24" height="12" fill="%2333CC33"/>
        <rect x="8" y="12" width="16" height="8" fill="%23FFCC00"/>
        <rect x="2" y="24" width="10" height="8" fill="%2333CC33"/>
        <rect x="20" y="24" width="10" height="8" fill="%2333CC33"/>
        <circle cx="10" cy="6" r="2" fill="%23FFFFFF"/>
        <circle cx="22" cy="6" r="2" fill="%23FFFFFF"/>
        <circle cx="10" cy="6" r="1" fill="%23000000"/>
        <circle cx="22" cy="6" r="1" fill="%23000000"/>
      </g>
      <!-- Frame 2 -->
      <g transform="translate(32,0)">
        <rect x="8" y="0" width="16" height="12" fill="%23009900"/>
        <rect x="4" y="12" width="24" height="12" fill="%2333CC33"/>
        <rect x="8" y="12" width="16" height="8" fill="%23FFCC00"/>
        <rect x="4" y="24" width="8" height="8" fill="%2333CC33"/>
        <rect x="20" y="24" width="8" height="8" fill="%2333CC33"/>
        <circle cx="10" cy="6" r="2" fill="%23FFFFFF"/>
        <circle cx="22" cy="6" r="2" fill="%23FFFFFF"/>
        <circle cx="10" cy="6" r="1" fill="%23000000"/>
        <circle cx="22" cy="6" r="1" fill="%23000000"/>
      </g>
    </svg>`,
    
    // Koopa shell for when stomped
    koopa_shell: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="4" y="8" width="24" height="16" fill="%2333CC33"/>
      <rect x="8" y="4" width="16" height="24" fill="%2333CC33"/>
      <rect x="8" y="12" width="16" height="8" fill="%23FFCC00"/>
      <line x1="8" y1="4" x2="24" y2="28" stroke="%23000000" stroke-width="1"/>
      <line x1="24" y1="4" x2="8" y2="28" stroke="%23000000" stroke-width="1"/>
    </svg>`,
  },
  collectibles: {
    // Coin animation (4 frames)
    coin: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="32" viewBox="0 0 128 32">
      <!-- Frame 1: Full coin -->
      <g transform="translate(0,0)">
        <circle cx="16" cy="16" r="14" fill="%23FFD700" stroke="%23000000" stroke-width="1"/>
        <text x="10" y="22" font-family="Arial" font-size="18" fill="%23AA8800">¢</text>
      </g>
      <!-- Frame 2: Slightly turned -->
      <g transform="translate(32,0)">
        <ellipse cx="16" cy="16" rx="11" ry="14" fill="%23FFD700" stroke="%23000000" stroke-width="1"/>
        <text x="11" y="22" font-family="Arial" font-size="16" fill="%23AA8800">¢</text>
      </g>
      <!-- Frame 3: Edge view -->
      <g transform="translate(64,0)">
        <ellipse cx="16" cy="16" rx="4" ry="14" fill="%23FFD700" stroke="%23000000" stroke-width="1"/>
        <line x1="16" y1="6" x2="16" y2="26" stroke="%23AA8800" stroke-width="2"/>
      </g>
      <!-- Frame 4: Back to appearing -->
      <g transform="translate(96,0)">
        <ellipse cx="16" cy="16" rx="11" ry="14" fill="%23FFD700" stroke="%23000000" stroke-width="1"/>
        <text x="11" y="22" font-family="Arial" font-size="16" fill="%23AA8800">¢</text>
      </g>
    </svg>`,
    
    // Super Mushroom (power-up)
    mushroom: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="20" r="12" fill="%23FF0000"/>
      <rect x="4" y="20" width="24" height="12" fill="%23FF0000"/>
      <rect x="8" y="16" width="16" height="4" fill="%23FFFFFF"/>
      <rect x="8" y="12" width="16" height="4" fill="%23FF0000"/>
      <circle cx="12" cy="12" r="4" fill="%23FFFFFF"/>
      <circle cx="20" cy="12" r="4" fill="%23FFFFFF"/>
      <rect x="12" y="24" width="8" height="8" fill="%23FFFFFF"/>
    </svg>`,
    
    // Star (invincibility)
    star: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="32" viewBox="0 0 128 32">
      <!-- Frame 1 -->
      <g transform="translate(0,0)">
        <polygon points="16,2 19,12 29,12 21,18 24,28 16,23 8,28 11,18 3,12 13,12" fill="%23FFD700" stroke="%23000000" stroke-width="1"/>
        <circle cx="12" cy="8" r="1.5" fill="%23FFFFFF"/>
      </g>
      <!-- Frame 2 -->
      <g transform="translate(32,0)">
        <polygon points="16,2 19,12 29,12 21,18 24,28 16,23 8,28 11,18 3,12 13,12" fill="%23FFD700" stroke="%23000000" stroke-width="1"/>
        <circle cx="12" cy="8" r="1.5" fill="%23FFFFFF"/>
      </g>
      <!-- Frame 3 -->
      <g transform="translate(64,0)">
        <polygon points="16,2 19,12 29,12 21,18 24,28 16,23 8,28 11,18 3,12 13,12" fill="%23FFB700" stroke="%23000000" stroke-width="1"/>
        <circle cx="12" cy="8" r="1.5" fill="%23FFFFFF"/>
      </g>
      <!-- Frame 4 -->
      <g transform="translate(96,0)">
        <polygon points="16,2 19,12 29,12 21,18 24,28 16,23 8,28 11,18 3,12 13,12" fill="%23FFFF00" stroke="%23000000" stroke-width="1"/>
        <circle cx="12" cy="8" r="1.5" fill="%23FFFFFF"/>
      </g>
    </svg>`,
    
    // Fire Flower
    fireflower: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="12" y="24" width="8" height="8" fill="%23009900"/>
      <circle cx="16" cy="18" r="8" fill="%23FFFFFF"/>
      <circle cx="16" cy="18" r="6" fill="%23FF0000"/>
      <circle cx="16" cy="18" r="4" fill="%23FF6600"/>
      <circle cx="16" cy="18" r="2" fill="%23FFFF00"/>
      <rect x="14" y="16" width="4" height="12" fill="%23009900" opacity="0.6"/>
    </svg>`,
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
