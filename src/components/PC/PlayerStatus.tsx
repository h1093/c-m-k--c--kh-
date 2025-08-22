


import React, { useState } from 'react';
import { StartingScenario, Quest, Companion, NPC, LoreEntry, LoreSummary, FactionRelations, Item } from '../../types';
import CodexDisplay from '../UI/CodexDisplay';

type PlayerView = 'bio' | 'quests' | 'companions' | 'factions' | 'npcs' | 'lore' | 'journal' | 'codex' | 'inventory';

const Section: React.FC<{ title: string; children: React.ReactNode; titleColor?: string; className?: string }> = ({ title, children, titleColor = "text-red-500", className = "" }) => (
    <div className={`ui-panel p-4 ${className}`}>
        <h3 className={`font-cinzel font-bold text-lg ${titleColor} mb-3 border-b-2 border-red-500/20 pb-2`}>{title}</h3>
        {children}
    </div>
);

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="relative flex items-center group">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 cursor-pointer" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-none py-2 px-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 border border-red-500/50">
      {text}
    </div>
  </div>
);

interface StatBarProps { value: number; maxValue: number; label: string; color: string; glowColor: string; tooltip?: string; }
const StatBar: React.FC<StatBarProps> = ({ value, maxValue, label, color, glowColor, tooltip }) => {
    const percentage = Math.max(0, (value / maxValue) * 100);
    return (
        <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
                 <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">{label}</span>
                    {tooltip && <InfoTooltip text={tooltip} />}
                </div>
                <span className="text-sm font-bold text-white">{value} / {maxValue}</span>
            </div>
            <div className="w-full bg-black/50 rounded-none h-3.5 p-0.5 border border-gray-700 shadow-inner">
                <div className={`${color} h-full transition-all duration-500 relative`} style={{ width: `${percentage}%` }}>
                   <div className="absolute inset-0 opacity-50" style={{ boxShadow: `0 0 8px 2px ${glowColor}` }}></div>
                </div>
            </div>
        </div>
    );
};

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

const getRelationshipColor = (relationship: 'ally' | 'friendly' | 'neutral' | 'hostile') => {
    switch (relationship) {
        case 'ally': return 'text-green-400 font-bold';
        case 'friendly': return 'text-cyan-400';
        case 'hostile': return 'text-red-400 font-bold';
        case 'neutral':
        default: return 'text-gray-400';
    }
};

interface PlayerStatusProps {
  name: string;
  biography: string;
  scenario: StartingScenario;
  psyche: number;
  maxPsyche: number;
  inventory: Item[];
  sideQuests: Quest[];
  companions: Companion[];
  npcs: NPC[];
  worldState: { [locationId: string]: string };
  loreEntries: LoreEntry[];
  loreSummaries: LoreSummary[];
  factionRelations: FactionRelations;
  kimLenh: number;
  dauAnDongThau: number;
  apiCalls: number;
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

const KimLenhIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.158-.103.346-.195.577-.291L6.75 4.75a.75.75 0 011.06-1.06l1.835 1.836a.75.75 0 001.06 0l1.836-1.836a.75.75 0 011.06 1.06L11 7.127c.231.096.419.188.577.291a.75.75 0 010 1.164c-.158.103-.346-.195-.577-.291l2.252 2.252a.75.75 0 01-1.06 1.06l-1.836-1.836a.75.75 0 00-1.06 0l-1.836 1.836a.75.75 0 01-1.06-1.06l2.252-2.252c-.231-.096-.419-.188-.577-.291a.75.75 0 010-1.164z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM3 10a7 7 0 1114 0 7 7 0 01-14 0z" clipRule="evenodd" /></svg>;
const DauAnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 10a1 1 0 00-1-1H2a1 1 0 000 2h1a1 1 0 001-1zm1 5a1 1 0 011-1h2a1 1 0 110 2H6a1 1 0 01-1-1zm9-5a1 1 0 100 2h1a1 1 0 100-2h-1zM6 5a1 1 0 00-1 1v2a1 1 0 102 0V6a1 1 0 00-1-1zm8 0a1 1 0 00-1 1v2a1 1 0 102 0V6a1 1 0 00-1-1zm9 10a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM9 10a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;

const PlayerStatus: React.FC<PlayerStatusProps> = ({ name, biography, scenario, psyche, maxPsyche, inventory, sideQuests, companions, npcs, worldState, loreEntries, loreSummaries, factionRelations, kimLenh, dauAnDongThau }) => {
    const [activeView, setActiveView] = useState<PlayerView>('bio');

    const renderContent = () => {
        switch (activeView) {
            case 'bio':
                const bioParts = { origin: 'Chưa rõ', incident: 'Chưa rõ', goal: 'Chưa rõ' };
                const originMatch = biography.match(/Nguồn gốc: (.*?)\. Biến cố:/);
                const incidentMatch = biography.match(/Biến cố: (.*?)\. Mục tiêu:/);
                const goalMatch = biography.match(/Mục tiêu: (.*)/);
                if (originMatch) bioParts.origin = originMatch[1];
                if (incidentMatch) bioParts.incident = incidentMatch[1];
                if (goalMatch) bioParts.goal = goalMatch[1];
                const hasStructuredBio = originMatch && incidentMatch && goalMatch;

                return (
                    <div className="animate-fade-in space-y-4">
                        <Section title="Trạng Thái Tinh Thần">
                           <StatBar value={psyche} maxValue={maxPsyche} label="Lý Trí" color="bg-gradient-to-r from-sky-500 to-sky-400" glowColor="#38bdf8" tooltip="Sự ổn định tinh thần của bạn. Nếu xuống quá thấp, thực tại có thể bắt đầu rạn nứt." />
                        </Section>
                        <Section title="Tiểu Sử">
                            {hasStructuredBio ? (
                                <div className="text-sm text-gray-300 bg-black/30 p-3 mt-2 space-y-2 border border-gray-700/50">
                                    <p><span className="font-semibold text-gray-400">Nguồn gốc:</span> <span className="italic">{bioParts.origin}</span></p>
                                    <p><span className="font-semibold text-gray-400">{scenario === 'human' ? 'Chi Tiết Bất Thường:' : 'Biến cố khởi đầu:'}</span> <span className="italic">{bioParts.incident}</span></p>
                                    <p><span className="font-semibold text-gray-400">Mục tiêu cá nhân:</span> <span className="italic">{bioParts.goal}</span></p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-300 bg-black/30 p-3 mt-2 italic border border-gray-700/50">{biography}</p>
                            )}
                        </Section>
                         <p className="text-center pt-4 text-gray-500 italic">Bạn vẫn chỉ là một con người. Sinh vật đầu tiên của bạn vẫn chưa được sinh ra từ máu và nỗi kinh hoàng. Con đường phía trước đầy rẫy những ám ảnh.</p>
                    </div>
                );
            case 'inventory': return (<div className="animate-fade-in"><Section title="Túi Đồ">{inventory.length > 0 ? inventory.map(item => <div key={item.id} className="bg-black/30 p-3 mb-2"><div className="flex justify-between items-center"><p className="font-semibold text-gray-300">{item.name}</p><p className="text-sm text-gray-400">x{item.quantity}</p></div><p className="text-xs italic text-gray-500 mt-1">{item.description}</p></div>) : <p className="italic text-gray-500 text-center">Trống.</p>}</Section></div>);
            case 'quests': return (<div className="animate-fade-in"><Section title="Nhật Ký Nhiệm Vụ">{sideQuests.map(q => <div key={q.id} className="text-sm bg-black/30 p-3 border-l-4 mb-2"><p className={`${q.status === 'active' ? 'text-red-300' : 'text-gray-500 line-through'}`}>{q.title}</p></div>)}</Section></div>);
            case 'journal': return (<div className="animate-fade-in"><Section title="Nhật Ký Tóm Tắt">{loreSummaries.map(s => <div key={s.id} className="text-sm bg-black/30 p-3 border-l-4 mb-2"><p className="font-semibold">Lượt {s.turnNumber}:</p><p className="italic text-gray-400">{s.summary}</p></div>)}</Section></div>);
            case 'companions': return (<div className="animate-fade-in"><Section title="Đồng Đội">{companions.map(c => <div key={c.id} className="bg-black/30 p-3 mb-2"><p className="font-semibold text-green-300">{c.name}</p><p className="text-xs italic text-gray-400">{c.description}</p></div>)}</Section></div>);
            case 'factions': return (<div className="animate-fade-in"><Section title="Quan Hệ Phe Phái">{Object.entries(factionRelations).map(([factionName, score]) => <div key={factionName} className="flex justify-between items-center bg-black/30 p-2 mb-2"><p>{factionName}</p><p className={`${score > 20 ? 'text-green-400' : score < -20 ? 'text-red-400' : 'text-gray-300'}`}>{score}</p></div>)}</Section></div>);
            case 'npcs': 
                return (
                    <div className="animate-fade-in">
                        <Section title="Hồ Sơ Nhân Vật">
                            {npcs.length > 0 ? (
                                <div className="space-y-3">
                                    {npcs.map(npc => (
                                        <details key={npc.id} className="bg-black/30 p-3 ui-panel border border-gray-700/50 transition-all duration-300 open:bg-gray-900/50 open:border-red-500/20">
                                            <summary className="font-semibold text-gray-200 list-none cursor-pointer flex justify-between items-center">
                                                <span>
                                                    {npc.name} 
                                                    <span className={`text-xs ml-2 capitalize ${getRelationshipColor(npc.relationship)}`}>({npc.relationship})</span>
                                                </span>
                                                <span className="text-xs text-gray-500 italic">{npc.location}</span>
                                            </summary>
                                            <div className="mt-3 pt-3 border-t border-red-500/10 text-sm text-gray-400 space-y-2">
                                                <p className="italic">{npc.description}</p>
                                                {npc.background && <p><span className="font-semibold text-gray-300">Lý lịch:</span> {npc.background}</p>}
                                                {npc.faction && <p><span className="font-semibold text-gray-300">Phe phái:</span> {npc.faction}</p>}
                                                {npc.goal && <p><span className="font-semibold text-gray-300">Mục tiêu:</span> {npc.goal}</p>}
                                                {npc.trangThai && <p><span className="font-semibold text-gray-300">Trạng thái:</span> {npc.trangThai}</p>}
                                                {npc.tuongTacCuoi && <p><span className="font-semibold text-gray-300">Tương tác cuối:</span> {npc.tuongTacCuoi}</p>}
                                                {npc.knowledge && npc.knowledge.length > 0 && (
                                                    <div>
                                                        <p className="font-semibold text-gray-300">Những điều đã biết về bạn:</p>
                                                        <ul className="list-disc list-inside pl-2 mt-1 space-y-1">
                                                            {npc.knowledge.map((fact, index) => <li key={index}>{fact}</li>)}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            ) : (
                                <p className="italic text-gray-500 text-center">Chưa gặp gỡ ai đáng chú ý.</p>
                            )}
                        </Section>
                    </div>
                );
            case 'lore': return (<div className="animate-fade-in"><Section title="Tri Thức Đã Thu Thập">{loreEntries.map(l => <details key={l.id} className="bg-black/30 p-3 cursor-pointer mb-2"><summary className="font-semibold text-gray-200 list-none">{l.title}</summary><p className="italic mt-2 pt-2 border-t border-red-500/10 text-gray-400">{l.content}</p></details>)}</Section></div>);
            case 'codex': return (<div className="animate-fade-in h-full"><CodexDisplay /></div>);
            default: return null;
        }
    };

    return (
        <aside className="ui-panel p-4 h-full flex flex-col">
            <div className="text-center mb-4 flex-shrink-0">
                <h2 className="text-2xl font-cinzel text-red-400">{name}</h2>
                <p className="text-sm text-gray-500">Một con người giữa thế giới méo mó</p>
            </div>

            <div className="mb-4 flex-shrink-0">
                 <div className="grid grid-cols-2 gap-3">
                    <StatDisplay label="Kim Lệnh" value={kimLenh} icon={<KimLenhIcon />} valueClassName="text-yellow-300"/>
                    <StatDisplay label="Dấu Ấn" value={dauAnDongThau} icon={<DauAnIcon />} valueClassName="text-gray-300"/>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-1 mb-4 border-y border-red-500/20 py-2 flex-shrink-0">
                <NavButton label="Tiểu Sử" view="bio" activeView={activeView} setActiveView={setActiveView} />
                <NavButton label="Túi Đồ" view="inventory" activeView={activeView} setActiveView={setActiveView} disabled={inventory.length === 0} />
                <NavButton label="Nhiệm Vụ" view="quests" activeView={activeView} setActiveView={setActiveView} disabled={sideQuests.length === 0} />
                <NavButton label="Nhật Ký" view="journal" activeView={activeView} setActiveView={setActiveView} disabled={loreSummaries.length === 0} />
                <NavButton label="Đồng Đội" view="companions" activeView={activeView} setActiveView={setActiveView} disabled={companions.length === 0} />
                <NavButton label="Phe Phái" view="factions" activeView={activeView} setActiveView={setActiveView} disabled={Object.keys(factionRelations).length === 0} />
                <NavButton label="Hồ Sơ" view="npcs" activeView={activeView} setActiveView={setActiveView} disabled={npcs.length === 0} />
                <NavButton label="Tri Thức" view="lore" activeView={activeView} setActiveView={setActiveView} disabled={loreEntries.length === 0} />
                <NavButton label="Sổ Tay" view="codex" activeView={activeView} setActiveView={setActiveView} />
            </div>

            <div className="mt-2 flex-grow overflow-y-auto pr-2">
                {renderContent()}
            </div>
        </aside>
    );
};

export default PlayerStatus;