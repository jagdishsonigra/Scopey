
import React, { useEffect, useState } from 'react';
import StartButton from '@/components/StartButton';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Zap, ScanFace, Code, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [floatingIcons, setFloatingIcons] = useState<Array<{id: number, x: number, y: number, icon: string, speed: number, size: number}>>([]);
  
  // Generate floating tech icons
  useEffect(() => {
    const icons = ['zap', 'scan', 'code', 'cpu'];
    const generateIcons = () => {
      const newIcons = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        icon: icons[Math.floor(Math.random() * icons.length)],
        speed: Math.random() * 1 + 0.2,
        size: Math.random() * 20 + 10
      }));
      setFloatingIcons(newIcons);
    };
    
    generateIcons();
    
    // Simulate icon movement
    const interval = setInterval(() => {
      setFloatingIcons(prev => 
        prev.map(icon => ({
          ...icon,
          y: icon.y - icon.speed > 0 ? icon.y - icon.speed : 100,
        }))
      );
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    // Sound implementation would go here in a real app
  };

  const renderIcon = (iconName: string, size: number) => {
    switch(iconName) {
      case 'zap': return <Zap style={{width: size, height: size}} />;
      case 'scan': return <ScanFace style={{width: size, height: size}} />;
      case 'code': return <Code style={{width: size, height: size}} />;
      case 'cpu': return <Cpu style={{width: size, height: size}} />;
      default: return <Zap style={{width: size, height: size}} />;
    }
  };

  return (
    <div className="cyber-gradient min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1)_0,transparent_70%)]"></div>
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-vr-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-vr-highlight/5 rounded-full blur-3xl"></div>
      
      {/* Floating tech icons */}
      {floatingIcons.map(icon => (
        <div 
          key={icon.id}
          className="absolute text-vr-accent/10"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
          }}
        >
          {renderIcon(icon.icon, icon.size)}
        </div>
      ))}
      
      {/* Sound toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed bottom-4 right-4 text-vr-slate hover:text-vr-accent glass-panel bg-transparent hover:bg-vr-slate/10"
        onClick={toggleSound}
      >
        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </Button>
      
      {/* Content */}
      <div className="relative z-10 text-center flex flex-col items-center">
        <div className="animate-breathe">
          <h1 className="accent-gradient font-bold text-5xl sm:text-6xl md:text-7xl mb-4 tracking-tight">
            Visionary Detect
          </h1>
          <p className="text-vr-slate text-lg mb-12 max-w-md mx-auto">
            Next-gen object detection with advanced computer vision and spatial awareness
          </p>
        </div>
        
        <StartButton className="mt-8" />
        
        {/* Demo mode button */}
        <Link to="/detection" className="mt-8 text-vr-accent/70 hover:text-vr-accent text-sm font-medium flex items-center gap-1.5 transition-colors hover:underline underline-offset-4">
          <ScanFace className="w-4 h-4" />
          Launch Demo Mode
        </Link>
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-vr-accent via-vr-highlight to-vr-lime opacity-70"></div>
      
      {/* Tech grid lines */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
    </div>
  );
};

export default Index;
