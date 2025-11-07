import React from 'react';
import LoadingSpinner from './icons/LoadingSpinner';
import SparklesIcon from './icons/SparklesIcon';

interface FeedbackCardProps {
  textFeedback: string | null;
  isLoading: boolean;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ textFeedback, isLoading }) => {
  return (
    <div className="bg-teal-100 border-4 border-teal-200 rounded-2xl shadow-lg p-6 min-h-[140px] flex flex-col justify-center items-center">
      <div className="flex items-center gap-3 mb-4">
        <SparklesIcon className="w-8 h-8 text-teal-500" />
        <h3 className="text-2xl font-black text-teal-800">Kata Asisten Ceria!</h3>
      </div>
      <div className="text-center text-xl text-teal-900 font-semibold">
        {isLoading && !textFeedback ? (
          <div className="flex items-center gap-3">
            <LoadingSpinner className="w-8 h-8 text-teal-600"/>
            <span>Asisten sedang melihat gerakanmu... Sabar ya!</span>
          </div>
        ) : textFeedback ? (
          <p>{textFeedback}</p>
        ) : (
          <p>Yuk, nyalakan kamera dan tirukan gerakannya! Asisten akan memberimu semangat!</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackCard;