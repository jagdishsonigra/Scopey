import React, { useEffect, useRef, useState } from 'react';

interface Detection {
  object: string;
  info: string;
  emotion?: string;
}

const VisionDetector: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8000/ws');
      
      ws.onopen = () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const frame = data.frame;
        const detections = data.detections;

        // Update video frame
        if (videoRef.current) {
          videoRef.current.src = `data:image/jpeg;base64,${frame}`;
        }

        // Update detections
        setDetections(detections);
      };

      ws.onclose = () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
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
  }, []);

  return (
    <div className="flex h-screen">
      {/* Camera Feed */}
      <div className="w-3/4 bg-black p-4">
        <video
          ref={videoRef}
          autoPlay
          className="w-full h-full object-contain"
        />
      </div>

      {/* Detection Info */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Detected Objects</h2>
        {!isConnected && (
          <div className="text-red-500 mb-4">
            Connecting to camera service...
          </div>
        )}
        {detections.length === 0 ? (
          <p>No objects detected</p>
        ) : (
          detections.map((detection, index) => (
            <div key={index} className="mb-4 p-3 bg-white rounded shadow">
              <h3 className="font-bold text-lg">{detection.object.toUpperCase()}</h3>
              <p className="text-sm mt-2">{detection.info}</p>
              {detection.emotion && (
                <p className="text-sm mt-2">
                  <span className="font-semibold">Emotion:</span> {detection.emotion}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VisionDetector; 