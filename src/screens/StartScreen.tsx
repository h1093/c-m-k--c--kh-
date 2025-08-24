

import React, { useState, useEffect } from 'react';
import { hasSaveGame } from '../services/saveService';
import ChangelogDisplay from '../components/UI/ChangelogDisplay';

interface StartScreenProps {
  onStart: () => void;
  onWorldCreation: () => void;
  onLoadGame: () => void;
  onShowLore: () => void;
  onGoToApiSetup: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onWorldCreation, onLoadGame, onShowLore, onGoToApiSetup }) => {
  const [isChangelogVisible, setIsChangelogVisible] = useState(false);
  const [saveExists, setSaveExists] = useState(false);

  useEffect(() => {
    setSaveExists(hasSaveGame());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fade-in">
      <div className="max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-cinzel font-bold text-red-700 drop-shadow-lg" style={{ textShadow: '0 0 25px rgba(185, 28, 28, 0.6)' }}>
          Cấm Kỵ Cơ Khí
        </h1>
        <p className="text-gray-500 mt-4 text-lg md:text-xl uppercase tracking-[0.2em]">
          Cuộc Phiêu Lưu Vận Hành Bởi AI
        </p>
        <p className="mt-8 text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Bước vào một câu chuyện kinh dị mặc định đầy ám ảnh, hoặc chế tác một vũ trụ hoàn toàn mới từ những cơn ác mộng của bạn. Lựa chọn là của bạn.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6">
            <button
              onClick={onStart}
              className="bg-red-800 hover:bg-red-700 text-gray-100 font-bold py-4 px-12 text-xl font-cinzel transition-all duration-300 shadow-lg hover:shadow-red-500/50 transform hover:scale-105 w-full sm:w-auto border border-red-600"
            >
              Bắt Đầu Mặc Định
            </button>
             <button
              onClick={onLoadGame}
              disabled={!saveExists}
              className="ui-button py-4 px-12 text-xl w-full sm:w-auto bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-gray-500 disabled:bg-gray-800/50 disabled:border-gray-700/50 disabled:text-gray-500 disabled:transform-none"
            >
              Tải Lại
            </button>
            <button
              onClick={onWorldCreation}
              className="ui-button py-4 px-12 text-xl w-full sm:w-auto"
            >
              Tạo Thế Giới Mới
            </button>
             <button
              onClick={onShowLore}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 font-bold py-4 px-12 text-xl font-cinzel transition-all duration-300 shadow-lg hover:shadow-gray-500/50 transform hover:scale-105 w-full sm:w-auto"
            >
              Sổ Tay Tri Thức
            </button>
            <button
              onClick={() => setIsChangelogVisible(true)}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 font-bold py-4 px-12 text-xl font-cinzel transition-all duration-300 shadow-lg hover:shadow-gray-500/50 transform hover:scale-105 w-full sm:w-auto"
            >
              Nhật ký cập nhật
            </button>
             <button
              onClick={onGoToApiSetup}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 font-bold py-4 px-12 text-xl font-cinzel transition-all duration-300 shadow-lg hover:shadow-gray-500/50 transform hover:scale-105 w-full sm:w-auto"
            >
              Thiết Lập API Key
            </button>
        </div>
      </div>
      {isChangelogVisible && <ChangelogDisplay onClose={() => setIsChangelogVisible(false)} />}
    </div>
  );
};

export default StartScreen;