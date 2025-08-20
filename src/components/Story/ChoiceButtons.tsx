import React from 'react';
import type { StorySegment } from '../../types';

interface ChoiceButtonsProps {
  segment: StorySegment | null;
  onChoice: (choice: string) => void;
}

const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ segment, onChoice }) => {
  if (!segment || segment.choices.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {segment.choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => onChoice(choice)}
            className="w-full text-left bg-red-900/30 hover:bg-red-900/60 border border-red-800 text-red-200 font-semibold py-3 px-4 transition-all duration-300 transform hover:border-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 shadow-lg"
          >
            {choice}
          </button>
        ))}
      </div>
      {segment.choices.length > 0 && (
          <button
            onClick={() => onChoice('EXPLORE_FREELY')}
            className="w-full bg-gray-800/60 hover:bg-gray-700/80 border border-gray-700 text-gray-300 font-semibold py-3 px-4 transition-all duration-300 transform hover:border-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a.5.5 0 00.5.5h2a.5.5 0 00.5-.5V7.5a1.5 1.5 0 011.5-1.5c.526 0 .988-.27 1.256-.679a6.002 6.002 0 012.088 2.706c.03.115.046.23.046.347 0 .546-.213 1.052-.593 1.432a.5.5 0 01-.707 0l-.55-.55a.5.5 0 00-.707 0l-1.414 1.414a.5.5 0 01-.707 0L9.05 9.914a.5.5 0 00-.707 0l-1.414 1.414a.5.5 0 01-.707 0l-.55-.55a.5.5 0 00-.707 0c-.38.38-.593.886-.593 1.432 0 .117.016.232.046.347a6.002 6.002 0 01-2.088 2.706 1.5 1.5 0 01-1.256-.679c-.526 0-.988.27-1.256.679a6.013 6.013 0 01-1.912-2.706A.5.5 0 014 9.5v-1a.5.5 0 01.332-.473z" clipRule="evenodd" />
              </svg>
              <span>Tự Do Khám Phá</span>
            </div>
          </button>
      )}
    </div>
  );
};

export default ChoiceButtons;
