import React, { useState } from 'react';
import { StartingScenario, Quest, Companion, NPC, LoreEntry, LoreSummary, FactionRelations } from '../../types';
import CodexDisplay from '../UI/CodexDisplay';

type PlayerView = 'bio' | 'quests' | 'companions' | 'factions' | 'world' | 'lore' | 'journal' | 'codex';

const Section: React.FC<{ title: string; children: React.ReactNode; titleColor?: string; className?: string }> = ({ title, children, titleColor = "text-red-500", className = "" }) => (
    <div className={`ui-panel p-4 ${className}`}>
        <h3 className={`font-cinzel font-bold text-lg ${titleColor} mb-3 border-b-2 border-red-500/20 pb-2`}>{title}</h3>
        {children}
    </div>
);

interface NavButtonProps {
    label: string;
    view: PlayerView;
    activeView: PlayerView;
    setActiveView: (view: PlayerView) => void;
    disabled?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ label, view, activeView, setActiveView, disabled = false }) => (
    <button
        onClick={() => setActiveView(view)}
        disabled={disabled}
        className={`px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 relative uppercase tracking-wider
            ${activeView === view
                ? 'bg-red-800/80 text-white shadow-md'
                : 'bg-black/30 text-gray-300 hover:bg-black/50'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
    >
        {label}
        {activeView === view && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-red-500"></div>}
    </button>
);


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
  factionRelations: FactionRelations;
  apiCalls: number;
  kimLenh: number;
  dauAnDongThau: number;
}

const StatDisplay: React.FC<{ label: string; value: string | number; icon: React.ReactNode; className?: string; valueClassName?: string }> = ({ label, value, icon, className = '', valueClassName = '' }) => (
    <div className={`bg-black/30 p-3 flex flex-col items-center justify-center text-center transition-colors duration-300 border border-gray-700/50 ${className}`}>
        <div className="flex items-center gap-2 text-gray-400">
            {icon}
            <p className="text-sm uppercase tracking-wider">{label}</p>
        </div>
        <p className={`text-2xl font-bold mt-1 font-cinzel ${valueClassName}`}>{value}</p>
    </div>
);

const KimLenhIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.158-.103.346-.195.577-.291L6.75 4.75a.75.75 0 011.06-1.06l1.835 1.836a3.242 3.242 0 01.378-.162.75.75 0 01.622 1.258l-1.12 2.238a.75.75 0 01-1.286-.644l.433-.866a1.745 1.745 0 00-.56-.252.75.75 0 01.12-.48z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.546l-.326-.42a.75.75 0 10-1.198.922l2.001 2.599a.75.75 0 001.147-.043l2-3a.75.75 0 10-1.15-1.076l-1.174 1.761V6.75z" clipRule="evenodd" /></svg>;
const DauAnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a.75.75 0 01.688.45l1.823 3.645.11.22a.75.75 0 00.518.518l.22.11 3.645 1.823a.75.75 0 010 1.376l-3.645 1.823-.22.11a.75.75 0 00-.518.518l-.11.22-1.823 3.645a.75.75 0 01-1.376 0l-1.823-3.645-.11-.22a.75.75 0 00-.518-.518l-.22-.11-3.645-1.823a.75.75 0 010-1.376l3.645-1.823.22-.11a.75.75 0 00.518-.518l.11-.22L9.312 2.45A.75.75 0 0110 2z" clipRule="evenodd" /></svg>;

const PlayerStatus: React.FC<PlayerStatusProps> = ({ name, biography, scenario, sideQuests, companions, npcs, worldState, loreEntries, loreSummaries, factionRelations, apiCalls, kimLenh, dauAnDongThau }) => {
  const [activeView, setActiveView] = useState<PlayerView>('bio');

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
  const hasFactions = Object.keys(factionRelations).length > 0;

  const getRelationColor = (score: number) => {
    if (score > 50) return 'bg-green-600';
    if (score > 10) return 'bg-green-800';
    if (score < -50) return 'bg-red-600';
    if (score < -10) return 'bg-red-800';
    return 'bg-gray-700';
  }

  const renderContent = () => {
    switch (activeView) {
      case 'bio':
        return (
          <div className="animate-fade-in space-y-4">
            <Section title="Tài Sản" titleColor="text-yellow-400">
               <div className="grid grid-cols-2 gap-3">
                    <StatDisplay label="Kim Lệnh" value={kimLenh} icon={<KimLenhIcon />} valueClassName="text-yellow-300" />
                    <StatDisplay label="Dấu Ấn" value={dauAnDongThau} icon={<DauAnIcon />} valueClassName="text-amber-500" />
               </div>
            </Section>
            <Section title="Tiểu Sử">
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
            </Section>
            <div className="text-center pt-4 mt-4">
              <p className="text-gray-500 italic text-sm">Bạn vẫn chỉ là một con người. Sinh vật đầu tiên của bạn vẫn chưa được sinh ra từ máu và nỗi kinh hoàng. Con đường phía trước đầy rẫy những ám ảnh.</p>
            </div>
          </div>
        );
      case 'quests':
        return (
          <Section title="Nhật Ký Nhiệm Vụ" className="animate-fade-in">
               <div className="space-y-2">
                  {sideQuests.map(quest => (
                      <div key={quest.id} className={`text-sm bg-black/30 p-3 border-l-4 ${quest.status === 'active' ? 'border-red-500' : 'border-gray-600'}`}>
                          <p className={`font-semibold ${quest.status === 'active' ? 'text-red-300' : 'text-gray-500 line-through'}`}>{quest.title}</p>
                          {quest.status === 'active' && <p className="italic text-gray-400 text-xs mt-1">{quest.description}</p>}
                      </div>
                  ))}
              </div>
          </Section>
        );
      case 'journal':
        return (
            <Section title="Nhật Ký Tóm Tắt" titleColor="text-gray-300" className="animate-fade-in">
                 <div className="space-y-3">
                    {loreSummaries.map(entry => (
                        <div key={entry.id} className="text-sm bg-black/30 p-3 border-l-4 border-gray-500">
                            <p className="font-semibold text-gray-300">Tóm tắt đến lượt {entry.turnNumber}:</p>
                            <p className="italic text-gray-400 mt-1">{entry.summary}</p>
                        </div>
                    ))}
                </div>
            </Section>
        );
      case 'companions':
        return (
          <Section title="Đồng Đội" className="animate-fade-in">
               <div className="space-y-2">
                  {companions.map(companion => (
                      <div key={companion.id} className="text-sm bg-black/30 p-3 border border-gray-700/50">
                          <p className="font-semibold text-gray-200">{companion.name}</p>
                          <p className="italic text-gray-400 text-xs mt-1">{companion.description}</p>
                           <div className="text-xs mt-2">HP: {companion.stats.hp} / {companion.stats.maxHp}</div>
                      </div>
                  ))}
              </div>
          </Section>
        );
      case 'factions':
        return (
           <Section title="Thế Lực" titleColor="text-gray-300" className="animate-fade-in">
              <div className="space-y-2">
                  {Object.entries(factionRelations).map(([faction, score]) => (
                      <div key={faction} className="bg-black/30 p-3 border border-gray-700/50">
                          <div className="flex justify-between items-center">
                              <p className="font-semibold text-gray-200">{faction}</p>
                              <p className="font-bold text-white">{score}</p>
                          </div>
                          <div className="w-full bg-black/50 h-2 mt-2 border border-gray-600">
                              <div className="h-full relative flex items-center justify-center transition-all duration-500" style={{ background: getRelationColor(score)}}>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </Section>
        );
      case 'lore':
        return (
          <Section title="Tri Thức Đã Thu Thập" titleColor="text-gray-300" className="animate-fade-in">
               <div className="space-y-2">
                  {loreEntries.map(entry => (
                      <details key={entry.id} className="text-sm bg-black/30 p-3 cursor-pointer transition-colors hover:bg-black/50 border-l-4 border-gray-500">
                          <summary className="font-semibold list-none focus:outline-none text-gray-300">{entry.title}</summary>
                          <p className="italic text-gray-400 mt-2 border-t border-red-500/20 pt-2">{entry.content}</p>
                      </details>
                  ))}
              </div>
          </Section>
        );
      case 'world':
        return (
           <Section title="Tình Hình Thế Giới" titleColor="text-gray-300" className="animate-fade-in">
              {npcs.length > 0 && (
                <div className="mb-3">
                   <h4 className="font-semibold text-gray-400 mb-1">Nhân Vật Đã Gặp</h4>
                   <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
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
                   <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {Object.entries(worldState).map(([loc, status]) => (
                         <div key={loc} className="text-sm bg-black/30 p-2 border border-gray-700/50">
                            <p className="font-semibold text-gray-200 capitalize">{loc.replace(/-/g, ' ')}: <span className="text-red-300">{status}</span></p>
                         </div>
                      ))}
                   </div>
                </div>
              )}
           </Section>
        );
      case 'codex':
          return <div className="h-full"><CodexDisplay /></div>;
      default:
        return null;
    }
  }

  return (
    <aside className="ui-panel p-4 h-full flex flex-col">
      <div className="text-center mb-4 flex-shrink-0">
        <h2 className="text-2xl font-cinzel text-red-400">{name}</h2>
        <p className="text-sm text-gray-500">Một con người giữa thế giới méo mó</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-4 border-y border-red-500/20 py-2 flex-shrink-0">
          <NavButton label="Tiểu Sử" view="bio" activeView={activeView} setActiveView={setActiveView} />
          <NavButton label="Nhiệm Vụ" view="quests" activeView={activeView} setActiveView={setActiveView} disabled={sideQuests.length === 0} />
          <NavButton label="Nhật Ký" view="journal" activeView={activeView} setActiveView={setActiveView} disabled={loreSummaries.length === 0} />
          <NavButton label="Thế Lực" view="factions" activeView={activeView} setActiveView={setActiveView} disabled={!hasFactions} />
          <NavButton label="Đồng Đội" view="companions" activeView={activeView} setActiveView={setActiveView} disabled={companions.length === 0} />
          <NavButton label="Thế Giới" view="world" activeView={activeView} setActiveView={setActiveView} disabled={!hasWorldInfo} />
          <NavButton label="Tri Thức" view="lore" activeView={activeView} setActiveView={setActiveView} disabled={loreEntries.length === 0} />
          <NavButton label="Sổ Tay" view="codex" activeView={activeView} setActiveView={setActiveView} />
      </div>
      
      <div className="mt-2 flex-grow overflow-y-auto pr-2">
        {renderContent()}
      </div>

      <div className="mt-auto pt-4 text-center text-xs text-gray-600 border-t border-red-500/10 flex-shrink-0">
        <p>Lượt Tương Tác AI: {apiCalls}</p>
      </div>
    </aside>
  );
};

export default PlayerStatus;