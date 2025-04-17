import { useEffect, useState } from "react";

interface Controls {
  left: boolean;
  right: boolean;
  jump: boolean;
}

const useKeyboard = (): Controls => {
  const [controls, setControls] = useState<Controls>({
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(`Key down: ${e.code}`);
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          setControls(prev => ({ ...prev, left: true }));
          break;
        case "ArrowRight":
        case "KeyD":
          setControls(prev => ({ ...prev, right: true }));
          break;
        case "Space":
        case "ArrowUp":
        case "KeyW":
          setControls(prev => ({ ...prev, jump: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      console.log(`Key up: ${e.code}`);
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          setControls(prev => ({ ...prev, left: false }));
          break;
        case "ArrowRight":
        case "KeyD":
          setControls(prev => ({ ...prev, right: false }));
          break;
        case "Space":
        case "ArrowUp":
        case "KeyW":
          setControls(prev => ({ ...prev, jump: false }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return controls;
};

export default useKeyboard;
