import React from 'react';
import type { Clue } from '../types';

interface ClueJournalProps {
  clues: Clue[];
}

const ClueJournal: React.FC<ClueJournalProps> = ({ clues }) => {
  if (clues.length === 0) {
    return null; // Don't render anything if there are no clues yet
  }

  return (
    <div className="ui-panel p-4 mt-6">
      <h3 className="text-xl font-cinzel text-red-500 mb-4 border-b-2 border-red-500/20 pb-2">Sổ Tay Điều Tra</h3>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {clues.map((clue) => (
          <div key={clue.id} className="bg-black/30 p-3 border border-gray-700/50 animate-fade-in">
            <p className="font-semibold text-red-300">{clue.title}</p>
            <p className="text-sm text-gray-400 italic mt-1">{clue.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClueJournal;