import React, { useState } from 'react';
import type { StorySegment } from '../../types';

interface ChoiceButtonsProps {
  segment: StorySegment | null;
  onChoice: (choice: string) => void;
}

const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ segment, onChoice }) => {
  const [customAction, setCustomAction] = useState('');

  // Nếu không có segment hoặc không có lựa chọn, đó là kết thúc của cảnh/trò chơi. Không hiển thị bất kỳ hành động nào.
  if (!segment || segment.choices.length === 0) {
    return null;
  }
  
  const handleCustomActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAction.trim()) {
      onChoice(customAction.trim());
      setCustomAction('');
    }
  };

  return (
    <div className="space-y-3 mt-4">
      {/* Lựa chọn có sẵn */}
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
      
      {/* Nút Gợi ý */}
      <div className="relative group">
        <button
            onClick={() => onChoice('GET_HINT')}
            className="w-full bg-gray-800/60 hover:bg-gray-700/80 border border-gray-700 text-gray-300 font-semibold py-3 px-4 transition-all duration-300 transform hover:border-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 shadow-lg"
        >
            <div className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>Gợi ý</span>
            </div>
        </button>
        <span className="tooltip">Yêu cầu Người Dẫn Lối (AI) đưa ra một gợi ý cho hành động tiếp theo.</span>
      </div>

      {/* Ô Nhập Hành Động Tùy Chỉnh */}
      <div className="pt-4 border-t border-red-500/10">
        <form onSubmit={handleCustomActionSubmit} className="flex gap-3">
          <input
            type="text"
            value={customAction}
            onChange={(e) => setCustomAction(e.target.value)}
            className="flex-grow ui-input px-4 py-3"
            placeholder="Hoặc, tự nhập hành động của bạn..."
            aria-label="Hành động tùy chỉnh"
          />
          <button type="submit" className="ui-button px-6 py-3">
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChoiceButtons;