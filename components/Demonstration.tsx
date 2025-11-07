import React from 'react';
import type { Movement } from '../types';

interface DemonstrationProps {
  movement: Movement | null;
}

const Demonstration: React.FC<DemonstrationProps> = ({ movement }) => {
  if (!movement) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-2xl p-6 text-center">
        <div>
            <div className="text-6xl mb-4">🤸</div>
            <p className="text-2xl text-gray-600 font-bold">Pilih gerakan untuk memulai petualangan!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
      <h2 className="text-3xl font-extrabold text-orange-600 mb-2">{movement.name}</h2>
      <p className="text-gray-600 text-lg mb-4">{movement.description}</p>
      <div className="flex-grow bg-gray-100 rounded-lg overflow-hidden">
        <img src={movement.image} alt={`Contoh gerakan ${movement.name}`} className="w-full h-full object-contain" />
      </div>
       <p className="text-center text-base text-gray-500 mt-4 font-semibold">Ini adalah contoh gerakannya. Ayo coba tirukan!</p>
    </div>
  );
};

export default Demonstration;