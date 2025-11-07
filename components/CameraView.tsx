import React, { useRef, useEffect, useCallback, useState } from 'react';
import CameraIcon from './icons/CameraIcon';
import LoadingSpinner from './icons/LoadingSpinner';
import { analyzeMovement } from '../services/geminiService';
import type { AnalysisResponse, BodyPart, Keypoint, Pose, PoseFeedback } from '../types';

const SKELETON_CONNECTIONS: [BodyPart, BodyPart][] = [
  ['left_shoulder', 'right_shoulder'],
  ['left_hip', 'right_hip'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
];

interface CameraViewProps {
  isCameraOn: boolean;
  movementName: string | null;
  onFeedback: (feedbackText: string | null) => void;
}

const drawPose = (ctx: CanvasRenderingContext2D, pose: Pose, feedback: PoseFeedback) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    SKELETON_CONNECTIONS.forEach(([start, end]) => {
        const startPoint = pose[start];
        const endPoint = pose[end];
        if (startPoint && endPoint && startPoint.x > 0 && endPoint.x > 0) {
            ctx.beginPath();
            ctx.moveTo(startPoint.x * width, startPoint.y * height);
            ctx.lineTo(endPoint.x * width, endPoint.y * height);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.stroke();
        }
    });

    // Draw keypoints
    Object.entries(pose).forEach(([part, point]) => {
        if (point && point.x > 0) {
            ctx.beginPath();
            ctx.arc(point.x * width, point.y * height, 8, 0, 2 * Math.PI);
            const feedbackStatus = feedback[part as BodyPart];
            ctx.fillStyle = feedbackStatus === 'correct' ? '#22c55e' : feedbackStatus === 'incorrect' ? '#ef4444' : '#3b82f6';
            ctx.fill();
        }
    });
};

const CameraView: React.FC<CameraViewProps> = ({ isCameraOn, movementName, onFeedback }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const enableCamera = async () => {
      if (isCameraOn) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera: ", err);
          alert("Tidak bisa mengakses kamera. Pastikan kamu sudah memberikan izin.");
        }
      } else {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      }
    };

    enableCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOn]);

  const handleAnalysis = useCallback(async () => {
    if (isLoading || !videoRef.current || !captureCanvasRef.current || !movementName) {
      return;
    }

    setIsLoading(true);
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg').split(',')[1];
      
      const result = await analyzeMovement(imageData, movementName);
      if (result) {
        setAnalysisResult(result);
        onFeedback(result.text);
      } else {
        onFeedback("Oops, ada masalah saat menganalisa. Coba lagi ya.");
      }
    }
    setIsLoading(false);
  }, [movementName, isLoading, onFeedback]);

  useEffect(() => {
    if (isCameraOn && movementName) {
      // Clear previous results when starting
      setAnalysisResult(null);
      onFeedback(null);
      intervalRef.current = window.setInterval(() => {
        handleAnalysis();
      }, 2500); // Analyze every 2.5 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isCameraOn, movementName, handleAnalysis, onFeedback]);
  
  useEffect(() => {
      if (overlayCanvasRef.current && analysisResult) {
          const overlayCtx = overlayCanvasRef.current.getContext('2d');
          if (overlayCtx) {
              drawPose(overlayCtx, analysisResult.pose, analysisResult.feedback);
          }
      } else if (overlayCanvasRef.current) {
          const overlayCtx = overlayCanvasRef.current.getContext('2d');
          overlayCtx?.clearRect(0,0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
      }
  }, [analysisResult]);


  return (
    <div className="bg-gray-900 rounded-2xl shadow-lg p-2 flex flex-col items-center justify-center relative aspect-[4/3] w-full max-w-2xl mx-auto">
      <canvas ref={captureCanvasRef} className="hidden"></canvas>
      {isCameraOn ? (
        <div className="relative w-full h-full">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full rounded-lg object-cover" muted></video>
          <canvas ref={overlayCanvasRef} className="absolute top-0 left-0 w-full h-full rounded-lg" width="640" height="480"></canvas>
          {isLoading && (
            <div className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 flex items-center gap-2 text-sm">
                <LoadingSpinner className="w-5 h-5" />
                <span>Menganalisa...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-400">
          <CameraIcon className="w-24 h-24 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">Kamera belum aktif</h3>
          <p className="mt-1">Pilih gerakan dan nyalakan kamera untuk mulai berlatih.</p>
        </div>
      )}
    </div>
  );
};

export default CameraView;