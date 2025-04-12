import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import DetectionOverlay from './DetectionOverlay';
import { Skeleton } from "@/components/ui/skeleton";
import { Layers, ScanSearch } from 'lucide-react';

interface CameraFeedProps {
  className?: string;
  onDetectionsUpdate?: (detections: any[]) => void;
}

interface Detection {
  id: string;
  label: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  info?: string;
  emotion?: string;
}

const CameraFeed = ({ className, onDetectionsUpdate }: CameraFeedProps) => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8000/ws');
      
      ws.onopen = () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
        setLoading(false);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const frame = data.frame;
        const newDetections = data.detections;

        // Update video frame
        if (videoRef.current) {
          videoRef.current.src = `data:image/jpeg;base64,${frame}`;
        }

        // Convert detections to the format expected by DetectionOverlay
        const formattedDetections = newDetections.map((det: any, index: number) => ({
          id: `det-${index}`,
          label: det.object,
          confidence: 0.9, // Default confidence
          x: 0, // These will be updated by the overlay
          y: 0,
          width: 0,
          height: 0,
          info: det.info,
          emotion: det.emotion
        }));

        setDetections(formattedDetections);
        if (onDetectionsUpdate) {
          onDetectionsUpdate(formattedDetections);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
        setLoading(true);
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [onDetectionsUpdate]);

  return (
    <div className={cn(
      "relative neo-card rounded-lg overflow-hidden w-full max-w-5xl aspect-video mx-auto",
      "shadow-[0_0_30px_rgba(0,0,0,0.3)]",
      className
    )}>
      {/* Loading state */}
      {loading ? (
        <div className="w-full h-full cyber-gradient flex flex-col items-center justify-center gap-6">
          <div className="relative w-24 h-24">
            <ScanSearch className="w-20 h-20 text-vr-accent animate-pulse" />
            <div className="absolute inset-0 w-full h-0.5 bg-vr-accent/50 animate-scanner"></div>
          </div>
          <div className="w-2/3 space-y-3">
            <Skeleton className="h-2 w-full bg-vr-slate/10" />
            <Skeleton className="h-2 w-5/6 mx-auto bg-vr-slate/10" />
            <div className="text-vr-slate/80 text-sm mt-4">
              {isConnected ? 'Initializing scanner...' : 'Connecting to vision service...'}
            </div>
          </div>
        </div>
      ) : (
        // Camera feed
        <div className="w-full h-full cyber-gradient flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-full object-cover"
          />
          {detections.length === 0 && (
            <p className="text-vr-accent text-center animate-pulse flex flex-col items-center absolute">
              <Layers className="mb-3 w-10 h-10 text-vr-accent/70" />
              Calibrating sensors...<br/>
              <span className="text-sm text-vr-slate/70 mt-2">Objects will be highlighted when detected</span>
            </p>
          )}
        </div>
      )}
      
      {/* Detection overlays */}
      {detections.map(detection => (
        <DetectionOverlay 
          key={detection.id} 
          detection={detection} 
        />
      ))}
      
      {/* Camera UI elements */}
      <div className="absolute bottom-4 right-4 glass-panel px-3 py-1 rounded-full text-xs text-vr-accent/90 flex items-center">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-vr-accent' : 'bg-red-500'} mr-2 animate-pulse`}></div>
        {isConnected ? 'LIVE' : 'CONNECTING...'}
      </div>
      
      {/* Grid overlay for tech effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(56,189,248,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
    </div>
  );
};

export default CameraFeed;
