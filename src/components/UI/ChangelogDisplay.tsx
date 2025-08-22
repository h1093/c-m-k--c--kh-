
import React from 'react';
import { changelog, ChangelogEntry } from '../../data/changelog';

interface ChangelogDisplayProps {
  onClose: () => void;
}

const ChangelogEntryDisplay: React.FC<{ entry: ChangelogEntry }> = ({ entry }) => (
  <div className="mb-6 pb-4 border-b border-red-500/20 last:border-b-0">
    <div className="flex justify-between items-baseline">
      <h3 className="text-2xl font-cinzel text-red-400">{entry.title}</h3>
      <span className="text-sm text-gray-500 font-mono">{entry.version} ({entry.date})</span>
    </div>
    <ul className="mt-3 list-disc list-inside space-y-2 text-gray-300">
      {entry.changes.map((change, index) => (
        <li key={index} dangerouslySetInnerHTML={{ __html: change.replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-300">$1</strong>') }}></li>
      ))}
    </ul>
  </div>
);

const ChangelogDisplay: React.FC<ChangelogDisplayProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="ui-panel p-6 w-full max-w-3xl h-[80vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4 flex-shrink-0">
          <h2 className="text-4xl font-cinzel text-red-500">Nhật Ký Cập Nhật</h2>
          <p className="text-gray-400 mt-1">Những thay đổi mới nhất trong thế giới Cấm Kỵ Cơ Khí.</p>
        </div>
        
        <div className="overflow-y-auto pr-4 flex-grow">
          {changelog.map(entry => <ChangelogEntryDisplay key={entry.version} entry={entry} />)}
        </div>
        
        <div className="mt-6 text-center flex-shrink-0 border-t border-red-500/20 pt-4">
          <button onClick={onClose} className="ui-button py-2 px-8">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangelogDisplay;
