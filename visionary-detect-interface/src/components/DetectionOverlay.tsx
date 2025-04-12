
import React from 'react';
import { cn } from '@/lib/utils';
import { Target, Check } from 'lucide-react';

interface Detection {
  id: string;
  label: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DetectionOverlayProps {
  detection: Detection;
  className?: string;
}

const DetectionOverlay = ({ detection, className }: DetectionOverlayProps) => {
  // Generate a unique color based on the label
  const getColorForLabel = (label: string) => {
    const colors = ['border-vr-accent', 'border-vr-highlight', 'border-vr-lime', 'border-vr-orange'];
    // Simple hash function to pick a consistent color for each label
    const index = label.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const boxColor = getColorForLabel(detection.label);
  const confidencePercent = (detection.confidence * 100).toFixed(1);

  return (
    <div 
      className={cn(
        "detection-box", 
        boxColor,
        className
      )}
      style={{
        left: `${detection.x}%`,
        top: `${detection.y}%`,
        width: `${detection.width}%`,
        height: `${detection.height}%`,
        boxShadow: `0 0 15px -5px rgba(56,189,248,0.4)`
      }}
    >
      {/* Ripple effect */}
      <div className="absolute inset-0 border-2 border-white/20 rounded-md animate-ping"></div>
      
      {/* Label tag */}
      <div className="absolute -top-7 left-0 glass-panel px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 shadow-lg">
        <Target className="w-3 h-3 text-vr-accent" />
        <span className="font-medium text-vr-light">{detection.label}</span>
        <div className="glass-panel bg-black/40 px-1.5 py-0.5 rounded-full">
          <span className="text-white/90 text-[10px] flex items-center">
            <Check className="w-2 h-2 mr-0.5 text-vr-lime" /> {confidencePercent}%
          </span>
        </div>
      </div>
      
      {/* Corner accents for tech look */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/40 rounded-tl-sm"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/40 rounded-tr-sm"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/40 rounded-bl-sm"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/40 rounded-br-sm"></div>
    </div>
  );
};

export default DetectionOverlay;
