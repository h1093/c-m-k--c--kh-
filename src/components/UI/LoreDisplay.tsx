
import React from 'react';
import CodexDisplay from './CodexDisplay';

interface LoreDisplayProps {
  onClose: () => void;
}

const LoreDisplay: React.FC<LoreDisplayProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="ui-panel p-6 w-full max-w-6xl h-[90vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4 flex-shrink-0">
          <h2 className="text-4xl font-cinzel text-red-500">Sổ Tay Về Các Định Luật Của Thế Giới</h2>
        </div>
        
        <div className="flex-grow overflow-hidden">
           <CodexDisplay />
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

export default LoreDisplay;
