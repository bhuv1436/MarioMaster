import { useState, useEffect } from "react";
import Game from "./game/Game";
import "@fontsource/inter";
import { useAudio } from "./lib/stores/useAudio";
import { Howl } from "howler";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setBackgroundMusic, setHitSound, setSuccessSound, toggleMute, isMuted } = useAudio();

  // Load audio assets
  useEffect(() => {
    // Background music
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    // Sound effects
    const hit = new Audio("/sounds/hit.mp3");
    hit.volume = 0.5;
    setHitSound(hit);

    const success = new Audio("/sounds/success.mp3");
    success.volume = 0.5;
    setSuccessSound(success);

    setLoading(false);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  const startGame = () => {
    setGameStarted(true);
    
    // Start background music if not muted
    if (!isMuted) {
      const bgMusic = new Audio("/sounds/background.mp3");
      bgMusic.loop = true;
      bgMusic.volume = 0.3;
      bgMusic.play().catch(error => {
        console.log("Background music play prevented:", error);
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-foreground">Loading game assets...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background">
      {!gameStarted ? (
        <Card className="w-[350px] shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground text-center rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Super Mario Bros</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center space-y-6">
            <p className="text-foreground text-center">
              A classic platformer game. Move with arrow keys or WASD, jump with spacebar. 
              Collect coins and avoid enemies!
            </p>
            
            <div className="flex space-x-4">
              <Button 
                onClick={toggleMute} 
                variant="outline"
                className="w-32"
              >
                {isMuted ? "Unmute Sound" : "Mute Sound"}
              </Button>
              
              <Button 
                onClick={startGame} 
                variant="default" 
                className="w-32"
              >
                Start Game
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground mt-4">
              <p>CONTROLS:</p>
              <p>➡️ Right: Arrow Right / D</p>
              <p>⬅️ Left: Arrow Left / A</p>
              <p>⬆️ Jump: Space</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Game />
      )}
    </div>
  );
}

export default App;
