
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Scan, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StartButtonProps {
  className?: string;
}

const StartButton = ({ className }: StartButtonProps) => {
  return (
    <Link to="/detection">
      <Button 
        className={cn(
          "relative overflow-hidden group text-lg bg-vr-accent text-vr-dark hover:bg-vr-accent/90 border-none",
          "shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] transition-all duration-300",
          "py-6 px-8 rounded-md font-medium",
          className
        )}
      >
        <div className="flex items-center gap-2 relative z-10">
          <Zap className="w-5 h-5 text-vr-dark animate-pulse" />
          <span>Initialize Scanner</span>
          <Scan className="w-5 h-5 ml-1" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-vr-accent/0 via-white/20 to-vr-accent/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </Button>
    </Link>
  );
};

export default StartButton;
