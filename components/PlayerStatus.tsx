import React from 'react';
import { StartingScenario, Quest, Companion } from '../types';

interface PlayerStatusProps {
  name: string;
  biography: string;
  scenario: StartingScenario;
  sideQuests: Quest[];
  companions: Companion[];
}

const Section: React.FC<{ title: string, children: React.ReactNode, titleColor?: string }> = ({ title, children, titleColor = "text-red-500" }) => (
    <div className="mt-4">
        <h3 className={`font-bold text-lg ${titleColor} mb-2 border-b-2 border-red-500/20 pb-2`}>{title}</h3>
        {children}
    </div>
);

const PlayerStatus: React.FC<PlayerStatusProps> = ({ name, biography, scenario, sideQuests, companions }) => {
  const bioParts = {
    origin: 'Chưa rõ',
    incident: 'Chưa rõ',
    goal: 'Chưa rõ',
  };

  const originMatch = biography.match(/Nguồn gốc: (.*?)\. Biến cố:/);
  const incidentMatch = biography.match(/Biến cố: (.*?)\. Mục tiêu:/);
  const goalMatch = biography.match(/Mục tiêu: (.*)/);

  if (originMatch) bioParts.origin = originMatch[1];
  if (incidentMatch) bioParts.incident = incidentMatch[1];
  if (goalMatch) bioParts.goal = goalMatch[1];
  
  const hasStructuredBio = originMatch && incidentMatch && goalMatch;

  return (
    <aside className="ui-panel p-6 h-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-cinzel text-red-400">{name}</h2>
        <p className="text-sm text-gray-500">Một con người giữa thế giới méo mó</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-lg text-red-500 mb-2 border-b-2 border-red-500/20 pb-2">Tiểu Sử</h3>
          {hasStructuredBio ? (
             <div className="text-sm text-gray-300 bg-black/30 p-3 mt-2 space-y-2 border border-gray-700/50">
                <div>
                    <span className="font-semibold text-gray-400">Nguồn gốc:</span>
                    <p className="italic">{bioParts.origin}</p>
                </div>
                 <div>
                    <span className="font-semibold text-gray-400">
                      {scenario === 'human' ? 'Chi Tiết Bất Thường:' : 'Biến cố khởi đầu:'}
                    </span>
                    <p className="italic">{bioParts.incident}</p>
                </div>
                 <div>
                    <span className="font-semibold text-gray-400">Mục tiêu cá nhân:</span>
                    <p className="italic">{bioParts.goal}</p>
                </div>
             </div>
          ) : (
             <p className="text-sm text-gray-300 bg-black/30 p-3 mt-2 italic border border-gray-700/50">{biography}</p>
          )}
        </div>

        {sideQuests.length > 0 && (
            <Section title="Nhật Ký Nhiệm Vụ">
                 <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {sideQuests.map(quest => (
                        <div key={quest.id} className={`text-sm bg-black/30 p-3 border-l-4 ${quest.status === 'active' ? 'border-red-500' : 'border-gray-600'}`}>
                            <p className={`font-semibold ${quest.status === 'active' ? 'text-red-300' : 'text-gray-500 line-through'}`}>{quest.title}</p>
                            {quest.status === 'active' && <p className="italic text-gray-400 text-xs mt-1">{quest.description}</p>}
                        </div>
                    ))}
                </div>
            </Section>
        )}

         {companions.length > 0 && (
            <Section title="Đồng Đội">
                 <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {companions.map(companion => (
                        <div key={companion.id} className="text-sm bg-black/30 p-3 border border-gray-700/50">
                            <p className="font-semibold text-gray-200">{companion.name}</p>
                            <p className="italic text-gray-400 text-xs mt-1">{companion.description}</p>
                             <div className="text-xs mt-2">HP: {companion.stats.hp} / {companion.stats.maxHp}</div>
                        </div>
                    ))}
                </div>
            </Section>
        )}
        
        <div className="text-center pt-4">
            <p className="text-gray-500 italic">Bạn vẫn chỉ là một con người. Sinh vật đầu tiên của bạn vẫn chưa được sinh ra từ máu và nỗi kinh hoàng. Con đường phía trước đầy rẫy những ám ảnh.</p>
        </div>
      </div>
    </aside>
  );
};

export default PlayerStatus;