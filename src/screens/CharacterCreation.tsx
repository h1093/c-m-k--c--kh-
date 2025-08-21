
import React, { useState } from 'react';
import { DEFAULT_QUESTS } from '../data/quests';
import type { StartingScenario, Difficulty } from '../types';
import { generateBiography } from '../logic/storyService';

interface CharacterCreationProps {
  onStart: (puppetMasterName: string, biography: string, mainQuest: string, startingScenario: StartingScenario, difficulty: Difficulty) => void;
}

interface DifficultyOptionProps {
    label: string;
    description: string;
    value: Difficulty;
    current: Difficulty;
    setter: (value: Difficulty) => void;
}

const DifficultyOption: React.FC<DifficultyOptionProps> = ({ label, description, value, current, setter }) => (
    <label className={`p-3 border-2 transition-all duration-200 cursor-pointer block text-center ${current === value ? 'bg-red-900/40 border-red-500' : 'bg-black/30 border-gray-700 hover:border-red-600'}`}>
        <input type="radio" name="difficulty" value={value} checked={current === value} onChange={() => setter(value)} className="sr-only" />
        <p className="font-bold text-red-300">{label}</p>
        <p className="text-sm text-gray-400">{description}</p>
    </label>
);

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onStart }) => {
  const [masterName, setMasterName] = useState('');
  const [origin, setOrigin] = useState('');
  const [incident, setIncident] = useState('');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');
  
  const [questSelection, setQuestSelection] = useState(DEFAULT_QUESTS[0].description);
  const [customQuest, setCustomQuest] = useState('');
  const [startingScenario, setStartingScenario] = useState<StartingScenario>('complete');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [canRetryBio, setCanRetryBio] = useState(false);
  
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
    onStart(masterName.trim(), biography, finalQuest, startingScenario, difficulty);
  };

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    setError('');
    setCanRetryBio(false);
    try {
        const result = await generateBiography(origin, incident, goal, startingScenario);
        setOrigin(result.origin);
        setIncident(result.incident);
        setGoal(result.goal);
    } catch (e) {
        setError(e instanceof Error ? e.message : 'Không thể tạo tiểu sử. Vui lòng thử lại.');
        setCanRetryBio(true);
    } finally {
        setIsGeneratingBio(false);
    }
};
  
  const isHumanScenario = startingScenario === 'human';

  return (
    <div className="w-full max-w-3xl mx-auto ui-panel p-8 animate-fade-in">
      <h2 className="text-4xl font-cinzel text-center text-red-600 mb-2">Tạo Nhân Vật</h2>
      <p className="text-center text-gray-400 mb-8">Hãy dệt nên sợi chỉ định mệnh của chính bạn.</p>
      
      {error && (
          <div className="text-center mb-6 bg-red-900/50 p-3 animate-pulse">
            <p className="text-red-400">{error}</p>
            {canRetryBio && (
                <button onClick={handleGenerateBio} className="ui-button text-sm py-1 px-3 mt-2">
                    Thử Lại
                </button>
            )}
          </div>
      )}
      
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
          <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-cinzel text-red-400">Tiểu Sử Của Bạn</h3>
              <button 
                  onClick={handleGenerateBio} 
                  disabled={isGeneratingBio}
                  className="ui-button text-xs py-1 px-3 bg-gray-700 border-gray-600 hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2"
                  title="Tạo ngẫu nhiên hoặc hoàn thành tiểu sử dựa trên thông tin đã nhập"
                  aria-label="Tạo tiểu sử ngẫu nhiên"
              >
                  {isGeneratingBio ? (
                      <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang tạo...
                      </>
                  ) : (
                      <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Ngẫu Nhiên
                      </>
                  )}
              </button>
          </div>
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

        {/* Difficulty Selection */}
        <div>
          <h3 className="text-xl font-cinzel text-red-400 mb-3">Độ Khó</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <DifficultyOption label="Dễ" description="Tận hưởng câu chuyện." value="easy" current={difficulty} setter={setDifficulty} />
            <DifficultyOption label="Thường" description="Cân bằng & thử thách." value="normal" current={difficulty} setter={setDifficulty} />
            <DifficultyOption label="Khó" description="Kẻ địch mạnh hơn." value="hard" current={difficulty} setter={setDifficulty} />
            <DifficultyOption label="Ác Mộng" description="Không khoan nhượng." value="nightmare" current={difficulty} setter={setDifficulty} />
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
