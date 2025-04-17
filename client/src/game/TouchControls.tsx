import React, { useState } from "react";
import { Button } from "../components/ui/button";

interface TouchControlsProps {
  onControlsChange: (controls: { left: boolean; right: boolean; jump: boolean }) => void;
}

const TouchControls: React.FC<TouchControlsProps> = ({ onControlsChange }) => {
  const [activeControls, setActiveControls] = useState({
    left: false,
    right: false,
    jump: false
  });
  
  const handleTouchStart = (control: "left" | "right" | "jump") => {
    const newControls = { ...activeControls, [control]: true };
    setActiveControls(newControls);
    onControlsChange(newControls);
  };
  
  const handleTouchEnd = (control: "left" | "right" | "jump") => {
    const newControls = { ...activeControls, [control]: false };
    setActiveControls(newControls);
    onControlsChange(newControls);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-background/50 z-10">
      <div className="flex gap-2">
        <Button
          className={`w-16 h-16 rounded-full flex items-center justify-center ${activeControls.left ? 'bg-primary' : 'bg-secondary'}`}
          onTouchStart={() => handleTouchStart("left")}
          onTouchEnd={() => handleTouchEnd("left")}
          onMouseDown={() => handleTouchStart("left")}
          onMouseUp={() => handleTouchEnd("left")}
          onMouseLeave={() => handleTouchEnd("left")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </Button>
        
        <Button
          className={`w-16 h-16 rounded-full flex items-center justify-center ${activeControls.right ? 'bg-primary' : 'bg-secondary'}`}
          onTouchStart={() => handleTouchStart("right")}
          onTouchEnd={() => handleTouchEnd("right")}
          onMouseDown={() => handleTouchStart("right")}
          onMouseUp={() => handleTouchEnd("right")}
          onMouseLeave={() => handleTouchEnd("right")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Button>
      </div>
      
      <Button
        className={`w-16 h-16 rounded-full flex items-center justify-center ${activeControls.jump ? 'bg-primary' : 'bg-secondary'}`}
        onTouchStart={() => handleTouchStart("jump")}
        onTouchEnd={() => handleTouchEnd("jump")}
        onMouseDown={() => handleTouchStart("jump")}
        onMouseUp={() => handleTouchEnd("jump")}
        onMouseLeave={() => handleTouchEnd("jump")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </Button>
    </div>
  );
};

export default TouchControls;
