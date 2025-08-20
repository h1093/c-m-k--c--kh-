import React, { useState } from 'react';
import { DEFAULT_QUESTS } from '../data/quests';
import type { StartingScenario } from '../types';

interface CharacterCreationProps {
  onStart: (puppetMasterName: string, biography: string, mainQuest: string, startingScenario: StartingScenario) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onStart }) => {
  const [masterName, setMasterName] = useState('');
  const [origin, setOrigin] = useState('');
  const [incident, setIncident] = useState('');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');
  
  const [questSelection, setQuestSelection] = useState(DEFAULT_QUESTS[0].description);
  const [customQuest, setCustomQuest] = useState('');
  const [startingScenario, setStartingScenario] = useState<StartingScenario>('complete');
  
  const handleStart = () => {
    if (!masterName.trim()) {
      setError('Vui lòng nhập tên của bạn.');
      return;
    }
    if (!origin.trim() || !incident.trim() || !goal.trim()) {
      setError('Vui lòng điền đầy đủ cả ba phần của tiểu sử. Chúng sẽ định hình câu chuyện của bạn.');
      return;
    }

    const biography = `Nguồn gốc: ${origin.trim()}. Biến cố: ${incident.trim()}. Mục tiêu: ${goal.trim()}`;

    let finalQuest = '';
    if (questSelection === 'custom') {
        if (!customQuest.trim()) {
            setError('Vui lòng mô tả nhiệm vụ chính của bạn.');
            return;
        }
        finalQuest = customQuest.trim();
    } else if (questSelection === 'none') {
        finalQuest = "Không có nhiệm vụ cụ thể nào. Mục tiêu của tôi là khám phá thế giới tăm tối này, sinh tồn và có thể tìm thấy mục đích trên đường đi.";
    } else {
        finalQuest = questSelection;
    }

    setError('');
    onStart(masterName.trim(), biography, finalQuest, startingScenario);
  };
  
  const isHumanScenario = startingScenario === 'human';

  return (
    <div className="w-full max-w-3xl mx-auto ui-panel p-8 animate-fade-in">
      <h2 className="text-4xl font-cinzel text-center text-red-600 mb-2">Tạo Nhân Vật</h2>
      <p className="text-center text-gray-400 mb-8">Hãy dệt nên sợi chỉ định mệnh của chính bạn.</p>
      
      {error && <p className="text-red-400 text-center mb-6 bg-red-900/50 p-3 animate-pulse">{error}</p>}
      
      <div className="space-y-6">

        {/* Name */}
        <div>
          <label htmlFor="masterName" className="block text-md font-medium text-red-400 mb-2">Tên của Nghệ Nhân Rối là gì?</label>
          <input
            type="text"
            id="masterName"
            value={masterName}
            onChange={(e) => setMasterName(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 py-3 px-4 text-white text-lg ui-input"
            placeholder="Ví dụ: Silas Vancroft"
            autoFocus
          />
        </div>

        {/* Biography */}
        <div>
          <h3 className="text-xl font-cinzel text-red-400 mb-3">Tiểu Sử Của Bạn</h3>
          <div className="space-y-3 bg-black/20 p-4 border-l-4 border-red-500/30">
            <div>
                <label htmlFor="origin" className="block text-sm font-semibold text-gray-300 mb-1">Nguồn Gốc</label>
                <input type="text" id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full bg-gray-800 border border-gray-600 py-2 px-3 text-white text-sm ui-input" placeholder="Bạn đến từ đâu? (VD: một thợ đồng hồ bị thất sủng...)" />
            </div>
             <div>
                <label htmlFor="incident" className="block text-sm font-semibold text-gray-300 mb-1">{isHumanScenario ? 'Một Chi Tiết Bất Thường' : 'Biến Cố Khởi Đầu'}</label>
                <input type="text" id="incident" value={incident} onChange={(e) => setIncident(e.target.value)} className="w-full bg-gray-800 border border-gray-600 py-2 px-3 text-white text-sm ui-input" placeholder={isHumanScenario ? "Một chi tiết lạ? (VD: tiếng lách cách lạ...)" : "Điều gì đã kéo bạn vào con đường này?" } />
            </div>
             <div>
                <label htmlFor="goal" className="block text-sm font-semibold text-gray-300 mb-1">Mục Tiêu Cá Nhân</label>
                <input type="text" id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full bg-gray-800 border border-gray-600 py-2 px-3 text-white text-sm ui-input" placeholder="Điều gì thôi thúc bạn? (VD: tìm kiếm sự thật...)" />
            </div>
          </div>
        </div>
        
        {/* Starting Scenario */}
        <div>
          <h3 className="text-xl font-cinzel text-red-400 mb-3">Kịch Bản Khởi Đầu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className={`p-3 border-2 transition-all duration-200 cursor-pointer block ${startingScenario === 'human' ? 'bg-red-900/40 border-red-500' : 'bg-black/30 border-gray-700 hover:border-red-600'}`}>
                  <input type="radio" name="startingScenario" value="human" checked={startingScenario === 'human'} onChange={() => setStartingScenario('human')} className="sr-only" />
                  <p className="font-bold text-red-300">Con Đường Trở Thành Nghệ Nhân</p>
                  <p className="text-sm text-gray-400">Bắt đầu như một người bình thường.</p>
              </label>
              <label className={`p-3 border-2 transition-all duration-200 cursor-pointer block ${startingScenario === 'complete' ? 'bg-red-900/40 border-red-500' : 'bg-black/30 border-gray-700 hover:border-red-600'}`}>
                  <input type="radio" name="startingScenario" value="complete" checked={startingScenario === 'complete'} onChange={() => setStartingScenario('complete')} className="sr-only" />
                  <p className="font-bold text-red-300">Hoàn Thành Chế Tác (Mặc định)</p>
                  <p className="text-sm text-gray-400">Bắt đầu với con rối đầu tiên của bạn.</p>
              </label>
              <label className={`p-3 border-2 transition-all duration-200 cursor-pointer block ${startingScenario === 'ritual' ? 'bg-red-900/40 border-red-500' : 'bg-black/30 border-gray-700 hover:border-red-600'}`}>
                  <input type="radio" name="startingScenario" value="ritual" checked={startingScenario === 'ritual'} onChange={() => setStartingScenario('ritual')} className="sr-only" />
                  <p className="font-bold text-red-300">Khởi Đầu Nghi Thức</p>
                  <p className="text-sm text-gray-400">Bắt đầu ngay trước nghi thức cuối cùng.</p>
              </label>
              <label className={`p-3 border-2 transition-all duration-200 cursor-pointer block ${startingScenario === 'chaos' ? 'bg-red-900/40 border-red-500' : 'bg-black/30 border-gray-700 hover:border-red-600'}`}>
                  <input type="radio" name="startingScenario" value="chaos" checked={startingScenario === 'chaos'} onChange={() => setStartingScenario('chaos')} className="sr-only" />
                  <p className="font-bold text-red-300">Giữa Cơn Hỗn Loạn</p>
                  <p className="text-sm text-gray-400">Bắt đầu giữa một nghi thức thảm họa.</p>
              </label>
          </div>
        </div>

        {/* Main Quest */}
        <div>
          <h3 className="text-xl font-cinzel text-red-400 mb-3">Nhiệm Vụ Chính</h3>
          <div className="space-y-3">
              <select value={questSelection} onChange={e => setQuestSelection(e.target.value)} className="w-full bg-gray-900 border border-gray-600 py-3 px-4 text-white ui-input">
                  {DEFAULT_QUESTS.map(quest => (<option key={quest.id} value={quest.description}>{quest.title}</option>))}
                  <option value="custom">Tự tạo nhiệm vụ...</option>
                  <option value="none">Không có nhiệm vụ cụ thể (Khám phá tự do)</option>
              </select>
              
              {questSelection === 'custom' && (
                  <textarea 
                    value={customQuest} 
                    onChange={(e) => setCustomQuest(e.target.value)} 
                    className="w-full bg-gray-900 border border-gray-600 py-3 px-4 text-white text-base ui-input animate-fade-in" 
                    placeholder="Mô tả mục tiêu cuối cùng của bạn..." 
                    rows={3} />
              )}
          </div>
        </div>

      </div>

      <div className="mt-12 pt-8 border-t border-red-500/20 flex justify-end items-center">
        <button
          onClick={handleStart}
          className="bg-red-700 hover:bg-red-600 text-gray-100 font-bold py-3 px-8 text-lg font-cinzel transition-colors duration-300 shadow-lg hover:shadow-red-500/50 ui-button"
        >
          Bắt Đầu Chế Tác
        </button>
      </div>
    </div>
  );
};

export default CharacterCreation;
