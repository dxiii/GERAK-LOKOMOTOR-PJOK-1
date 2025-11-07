import React from 'react';
import type { Movement } from '../types';

interface MovementCardProps {
  movement: Movement;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const MovementCard: React.FC<MovementCardProps> = ({ movement, isSelected, onClick }) => {
  return (
    <div
      onClick={() => onClick(movement.id)}
      className={`
        p-4 rounded-2xl border-4 cursor-pointer transition-all duration-300 transform hover:-translate-y-2
        ${isSelected 
          ? 'border-orange-500 bg-orange-100 ring-4 ring-orange-300/50 scale-105 shadow-xl' 
          : 'border-gray-200 bg-white hover:border-orange-400 hover:shadow-lg'
        }
      `}
    >
      <img src={movement.image} alt={movement.name} className="w-full h-40 object-cover rounded-lg mb-4 shadow-inner" />
      <h3 className="text-2xl font-bold text-center text-gray-800">{movement.name}</h3>
    </div>
  );
};

export default MovementCard;