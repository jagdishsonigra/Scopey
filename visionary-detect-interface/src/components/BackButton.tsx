
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
}

const BackButton = ({ className }: BackButtonProps) => {
  return (
    <Link to="/">
      <Button 
        className={cn(
          "glass-panel bg-vr-slate/10 hover:bg-vr-slate/20 border-vr-accent/30",
          "fixed top-4 left-4 z-50 text-vr-accent",
          "transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]",
          className
        )}
        variant="outline"
        size="icon"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
    </Link>
  );
};

export default BackButton;
