import React from 'react';
import { StartingScenario, Quest, Companion, NPC, LoreEntry, LoreSummary } from '../../types';

interface PlayerStatusProps {
  name: string;
  biography: string;
  scenario: StartingScenario;
  sideQuests: Quest[];
  companions: Companion[];
  npcs: NPC[];
  worldState: { [locationId: string]: string };
  loreEntries: LoreEntry[];
  loreSummaries: LoreSummary[];
}

const Section: React.FC<{ title: string, children: React.ReactNode, titleColor?: string }> = ({ title, children, titleColor = "text-red-500" }) => (
    <div className="mt-4">
        <h3 className={`font-bold text-lg ${titleColor} mb-2 border-b-2 border-red-500/20 pb-2`}>{title}</h3>
        {children}
    </div>
);

const PlayerStatus: React.FC<PlayerStatusProps> = ({ name, biography, scenario, sideQuests, companions, npcs, worldState, loreEntries, loreSummaries }) => {
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
  const hasWorldInfo = npcs.length > 0 || Object.keys(worldState).length > 0;

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
        
        {loreSummaries.length > 0 && (
            <Section title="Nhật Ký Tóm Tắt" titleColor="text-gray-300">
                 <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                    {loreSummaries.map(entry => (
                        <div key={entry.id} className="text-sm bg-black/30 p-3 border-l-4 border-gray-500">
                            <p className="font-semibold text-gray-300">Tóm tắt đến lượt {entry.turnNumber}:</p>
                            <p className="italic text-gray-400 mt-1">{entry.summary}</p>
                        </div>
                    ))}
                </div>
            </Section>
        )}

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

        {loreEntries.length > 0 && (
            <Section title="Tri Thức Đã Thu Thập" titleColor="text-gray-300">
                 <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {loreEntries.map(entry => (
                        <details key={entry.id} className="text-sm bg-black/30 p-3 cursor-pointer transition-colors hover:bg-black/50 border-l-4 border-gray-500">
                            <summary className="font-semibold list-none focus:outline-none text-gray-300">{entry.title}</summary>
                            <p className="italic text-gray-400 mt-2 border-t border-red-500/20 pt-2">{entry.content}</p>
                        </details>
                    ))}
                </div>
            </Section>
        )}

        {hasWorldInfo && (
           <Section title="Tình Hình Thế Giới" titleColor="text-gray-300">
              {npcs.length > 0 && (
                <div className="mb-3">
                   <h4 className="font-semibold text-gray-400 mb-1">Nhân Vật Đã Gặp</h4>
                   <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                      {npcs.map(npc => (
                         <details key={npc.id} className="text-sm bg-black/30 p-2 border border-gray-700/50 cursor-pointer">
                            <summary className="font-semibold text-gray-200 list-none focus:outline-none">{npc.name} <span className="text-xs text-gray-500">({npc.relationship}) - {npc.location}</span></summary>
                            <div className="mt-2 pt-2 border-t border-red-500/20 space-y-1">
                                <p className="italic text-gray-400 text-xs">{npc.description}</p>
                                {npc.goal && <p className="text-xs text-purple-300"><span className="font-semibold">Mục tiêu:</span> {npc.goal}</p>}
                                {npc.knowledge && npc.knowledge.length > 0 && (
                                    <div className="text-xs text-gray-400">
                                        <p className="font-semibold text-gray-300">Biết về bạn:</p>
                                        <ul className="list-disc list-inside pl-2">
                                            {npc.knowledge.map((fact, i) => <li key={i}>{fact}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </details>
                      ))}
                   </div>
                </div>
              )}
               {Object.keys(worldState).length > 0 && (
                 <div>
                   <h4 className="font-semibold text-gray-400 mb-1">Trạng Thái Địa Điểm</h4>
                   <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                      {Object.entries(worldState).map(([loc, status]) => (
                         <div key={loc} className="text-sm bg-black/30 p-2 border border-gray-700/50">
                            <p className="font-semibold text-gray-200 capitalize">{loc.replace(/-/g, ' ')}: <span className="text-red-300">{status}</span></p>
                         </div>
                      ))}
                   </div>
                </div>
              )}
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