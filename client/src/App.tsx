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
    <div className="h-screen w-screen flex flex-col items-center justify-center" 
         style={{
           background: 'linear-gradient(to bottom, #87CEEB, #1E90FF)',
           overflow: 'hidden',
           position: 'relative'
         }}>
      
      {/* Decorative clouds */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-80"
            style={{
              width: `${Math.random() * 150 + 50}px`,
              height: `${Math.random() * 80 + 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animation: `float ${Math.random() * 40 + 30}s linear infinite`,
              animationDelay: `${Math.random() * -40}s`,
            }}
          />
        ))}
      </div>
      
      {/* Stylized ground */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-green-800 to-green-600">
        <div className="absolute bottom-0 w-full h-10 bg-gradient-to-t from-amber-800 to-amber-700" />
      </div>
      
      {!gameStarted ? (
        <div className="relative z-10">
          <Card className="w-[400px] shadow-2xl border-4 border-yellow-500 bg-white/90 backdrop-blur-md">
            <CardHeader className="bg-red-600 text-white text-center rounded-t-lg p-6">
              <CardTitle className="text-4xl font-bold" style={{ fontFamily: 'Georgia, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                Super Mario Bros
              </CardTitle>
            </CardHeader>
            
            <div className="p-2 bg-yellow-500 flex justify-center">
              <div className="bg-yellow-300 w-full h-4 flex items-center justify-around px-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-yellow-600" />
                ))}
              </div>
            </div>
            
            <CardContent className="p-6 flex flex-col items-center space-y-6">
              <p className="text-foreground text-center text-lg">
                A classic platformer game. Explore levels, collect coins, and avoid enemies on your adventure!
              </p>
              
              <div className="flex flex-col space-y-4 w-full max-w-xs">
                <Button 
                  onClick={startGame} 
                  variant="default" 
                  className="w-full py-6 text-lg font-bold bg-red-600 hover:bg-red-700 transition-all transform hover:scale-105"
                  style={{ boxShadow: '0 4px 0 rgb(153, 27, 27)' }}
                >
                  START ADVENTURE
                </Button>
                
                <Button 
                  onClick={toggleMute} 
                  variant="outline"
                  className="w-full bg-white border-2 border-gray-300"
                >
                  {isMuted ? "🔇 Unmute Sound" : "🔊 Mute Sound"}
                </Button>
              </div>
              
              <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 w-full">
                <h3 className="font-bold text-center mb-2 text-slate-800">CONTROLS</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <div className="bg-slate-200 w-8 h-8 flex items-center justify-center rounded mr-2">⬅️</div>
                    <span>Left: Arrow / A</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-slate-200 w-8 h-8 flex items-center justify-center rounded mr-2">➡️</div>
                    <span>Right: Arrow / D</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-slate-200 w-8 h-8 flex items-center justify-center rounded mr-2">⬆️</div>
                    <span>Jump: Space</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-slate-200 w-8 h-8 flex items-center justify-center rounded mr-2">🏁</div>
                    <span>Goal: Reach end!</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Game />
      )}
      
      {/* Add cloud animation styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            from { transform: translateX(100vw); }
            to { transform: translateX(-150px); }
          }
        `
      }} />
    </div>
  );
}

export default App;
