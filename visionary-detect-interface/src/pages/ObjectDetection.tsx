import React, { useState } from 'react';
import BackButton from '@/components/BackButton';
import CameraFeed from '@/components/CameraFeed';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Glasses, ChevronDown, ChevronUp, Layers, Cpu, Gauge } from 'lucide-react';

interface Detection {
  id: string;
  label: string;
  confidence: number;
  info?: string;
  emotion?: string;
}

const ObjectDetection = () => {
  const [vrMode, setVrMode] = useState(false);
  const [statsExpanded, setStatsExpanded] = useState(true);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [fps, setFps] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  const toggleVrMode = () => {
    setVrMode(!vrMode);
  };

  const handleDetectionsUpdate = (newDetections: Detection[]) => {
    setDetections(newDetections);
    
    // Calculate FPS
    const now = Date.now();
    const elapsed = now - lastUpdate;
    if (elapsed > 0) {
      setFps(Math.round(1000 / elapsed));
    }
    setLastUpdate(now);
  };
  
  // Calculate average confidence
  const averageConfidence = detections.length > 0
    ? Math.round((detections.reduce((sum, det) => sum + det.confidence, 0) / detections.length) * 100)
    : 0;
  
  return (
    <div className="cyber-gradient min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0,transparent_70%)]"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-vr-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-vr-highlight/5 rounded-full blur-3xl"></div>
      
      {/* Back button */}
      <BackButton />
      
      {/* VR Mode toggle */}
      <Button 
        onClick={toggleVrMode}
        className={`
          fixed top-4 right-4 z-50 text-sm rounded-md px-3 py-1
          transition-all duration-300 ${vrMode ? 'bg-vr-accent text-vr-dark' : 'glass-panel bg-transparent text-vr-accent border-vr-accent/30'}
        `}
        variant={vrMode ? "default" : "outline"}
        size="sm"
      >
        <Glasses className="w-4 h-4 mr-1" /> 
        {vrMode ? 'Exit VR' : 'VR Mode'}
      </Button>
      
      {/* Detection title */}
      <div className="text-center mb-6 animate-fade-in">
        <h2 className="text-vr-light text-2xl font-medium">Object Detection</h2>
        <p className="text-vr-slate text-sm">Real-time vision processing active</p>
      </div>
      
      {/* Camera feed with detections */}
      <CameraFeed 
        className="mb-6" 
        onDetectionsUpdate={handleDetectionsUpdate}
      />
      
      {/* Detection stats */}
      <Card className={`
        neo-card rounded-lg transition-all duration-300 overflow-hidden
        ${statsExpanded ? 'w-full max-w-xl' : 'w-auto rounded-full'}
      `}>
        <CardContent className={`p-0 ${statsExpanded ? 'py-4 px-6' : 'py-2 px-4'}`}>
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {statsExpanded ? (
                <div className="grid grid-cols-3 gap-6 text-sm">
                  <div className="flex flex-col items-center py-2">
                    <div className="flex items-center gap-1.5 text-vr-slate mb-1">
                      <Layers className="w-4 h-4" />
                      <span>Objects</span>
                    </div>
                    <span className="text-vr-accent font-medium text-xl">{detections.length}</span>
                  </div>
                  <div className="flex flex-col items-center py-2 border-x border-vr-slate/10">
                    <div className="flex items-center gap-1.5 text-vr-slate mb-1">
                      <Gauge className="w-4 h-4" />
                      <span>Confidence</span>
                    </div>
                    <span className="text-vr-highlight font-medium text-xl">{averageConfidence}%</span>
                  </div>
                  <div className="flex flex-col items-center py-2">
                    <div className="flex items-center gap-1.5 text-vr-slate mb-1">
                      <Cpu className="w-4 h-4" />
                      <span>FPS</span>
                    </div>
                    <span className="text-vr-lime font-medium text-xl animate-pulse">{fps}</span>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 text-xs py-1">
                  <span className="text-vr-accent flex items-center gap-1"><Layers className="w-3 h-3" /> {detections.length}</span>
                  <span className="text-vr-highlight flex items-center gap-1"><Gauge className="w-3 h-3" /> {averageConfidence}%</span>
                  <span className="text-vr-lime animate-pulse flex items-center gap-1"><Cpu className="w-3 h-3" /> {fps} FPS</span>
                </div>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-vr-slate hover:text-vr-accent ml-2"
              onClick={() => setStatsExpanded(!statsExpanded)}
            >
              {statsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Tech grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      
      {/* Status indicator */}
      <div className="fixed bottom-4 left-4 glass-panel py-1.5 px-3 rounded-md flex items-center shadow-md">
        <div className="w-2 h-2 rounded-full bg-vr-accent animate-pulse mr-2"></div>
        <span className="text-xs text-vr-light">Scanner Active</span>
      </div>
    </div>
  );
};

export default ObjectDetection;
