import React, { useState, useMemo, useCallback } from 'react';
import type { Movement } from './types';
import MovementCard from './components/MovementCard';
import Demonstration from './components/Demonstration';
import CameraView from './components/CameraView';
import FeedbackCard from './components/FeedbackCard';
import CameraIcon from './components/icons/CameraIcon';

const MOVEMENTS_DATA: Movement[] = [
  { id: 'berjalan', name: 'Berjalan', description: 'Gerakan melangkahkan kaki secara bergantian ke depan dengan badan tegap.', image: 'https://media.baamboozle.com/uploads/images/149503/1618903719_38491_gif-url.gif' },
  { id: 'berlari', name: 'Berlari', description: 'Gerakan melangkahkan kaki dengan cepat, ada saatnya kedua kaki tidak menapak tanah.', image: 'https://i.pinimg.com/originals/1a/39/3c/1a393c3b5d1912c9b216c52b343c16e7.gif' },
  { id: 'melompat', name: 'Melompat', description: 'Gerakan menolakkan badan ke atas dengan satu atau kedua kaki, lalu mendarat dengan kedua kaki.', image: 'https://static.wixstatic.com/media/253305_a8728ed5c8084a919316035e4b786f4a~mv2.gif' },
];

const App: React.FC = () => {
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // This can be used for global loading states if needed
  const [textFeedback, setTextFeedback] = useState<string | null>(null);

  const selectedMovement = useMemo(
    () => MOVEMENTS_DATA.find(m => m.id === selectedMovementId) || null,
    [selectedMovementId]
  );

  const handleSelectMovement = (id: string) => {
    setSelectedMovementId(id);
    setTextFeedback(null); // Reset feedback when changing movement
    if (isCameraOn) {
      // If camera is on, changing movement should restart the analysis loop
      // which is handled inside CameraView based on movementName prop change
    }
  };

  const handleToggleCamera = () => {
    if (!selectedMovementId) {
        alert("Pilih salah satu gerakan dulu ya sebelum menyalakan kamera!");
        return;
    }
    const newCameraState = !isCameraOn;
    setIsCameraOn(newCameraState);
    if (!newCameraState) {
      setTextFeedback(null); // Clear feedback when camera is turned off
    }
  }

  const handleFeedbackUpdate = useCallback((feedback: string | null) => {
      setTextFeedback(feedback);
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <header className="bg-gradient-to-r from-orange-400 to-rose-400 shadow-lg p-4 sticky top-0 z-10 text-white">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-extrabold tracking-wider">Ayo Belajar Gerak Lokomotor!</h1>
            <button
                onClick={handleToggleCamera}
                disabled={!selectedMovementId}
                className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-full transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:scale-100
                ${isCameraOn ? 'bg-red-500 hover:bg-red-600 shadow-md' : 'bg-green-500 hover:bg-green-600 shadow-md'}`}
            >
                <CameraIcon className="w-6 h-6"/>
                <span>{isCameraOn ? 'Matikan Kamera' : 'Nyalakan Kamera'}</span>
            </button>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <section className="text-center mb-10">
          <h2 className="text-4xl font-black text-orange-600 mb-2 drop-shadow-sm">Pilih Gerakan yang Kamu Suka!</h2>
          <p className="text-lg text-gray-600">Klik salah satu gambar di bawah ini untuk mulai berlatih, ya!</p>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {MOVEMENTS_DATA.map(movement => (
            <MovementCard
              key={movement.id}
              movement={movement}
              isSelected={selectedMovementId === movement.id}
              onClick={handleSelectMovement}
            />
          ))}
        </section>

        {selectedMovementId && (
            <div className="bg-white/70 backdrop-blur-lg p-4 md:p-8 rounded-3xl shadow-2xl border-4 border-orange-200">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div>
                        <h3 className="text-3xl font-black text-rose-500 mb-4 text-center">Contoh Gerakan</h3>
                        <Demonstration movement={selectedMovement} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-sky-500 mb-4 text-center">Tirukan Aku!</h3>
                        <CameraView 
                            isCameraOn={isCameraOn} 
                            movementName={selectedMovement?.name || null}
                            onFeedback={handleFeedbackUpdate}
                        />
                    </div>
                </div>
                <div className="mt-8">
                    <FeedbackCard textFeedback={textFeedback} isLoading={isLoading} />
                </div>
            </div>
        )}

      </main>

      <footer className="text-center p-6 text-gray-500 text-sm mt-8">
        <p>✨ Dibuat dengan ceria untuk pembelajaran yang menyenangkan. ✨</p>
      </footer>
    </div>
  );
};

export default App;