import React, { useState } from 'react';
import type { Puppet, Component, Quest, Companion, NPC, LoreEntry, LoreSummary } from '../../types';

// Component nội bộ để hiển thị tooltip thông tin khi di chuột qua
const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="relative flex items-center group">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-none py-2 px-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 border border-red-500/50">
      {text}
    </div>
  </div>
);

// Component nội bộ để hiển thị thanh chỉ số với tooltip tùy chọn
interface StatBarProps {
  value: number;
  maxValue: number;
  label: string;
  color: string;
  glowColor: string;
  tooltip?: string;
}
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


// Component nội bộ để hiển thị một chỉ số với biểu tượng
const StatDisplay: React.FC<{ label: string; value: string | number; icon: React.ReactNode; className?: string; valueClassName?: string }> = ({ label, value, icon, className = '', valueClassName = '' }) => (
    <div className={`bg-black/30 p-3 flex flex-col items-center justify-center text-center transition-colors duration-300 border border-gray-700/50 ${className}`}>
        <div className="flex items-center gap-2 text-gray-400">
            {icon}
            <p className="text-sm uppercase tracking-wider">{label}</p>
        </div>
        <p className={`text-xl font-bold mt-1 font-cinzel ${valueClassName}`}>{value}</p>
    </div>
);

// Component nội bộ cho tiêu đề của mỗi khu vực
const Section: React.FC<{ title: string, children: React.ReactNode, titleColor?: string }> = ({ title, children, titleColor = "text-red-500" }) => (
    <div className="ui-panel p-4">
        <h3 className={`font-cinzel font-bold text-lg ${titleColor} mb-3 border-b-2 border-red-500/20 pb-2`}>{title}</h3>
        {children}
    </div>
);

// Các biểu tượng SVG
const AttackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const DefenseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const EssenceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-200" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0L8 8.25H3.17c-1.56.38-1.56 2.6 0 2.98L8 11.75v5.08c.38 1.56 2.6 1.56 2.98 0L11.5 11.75h4.83c1.56-.38 1.56-2.6 0-2.98L11.5 8.25V3.17z" clipRule="evenodd" /></svg>;

type PuppetView = 'stats' | 'skills' | 'components' | 'mutations' | 'memories' | 'design' | 'inventory' | 'quests' | 'companions' | 'world' | 'lore' | 'journal';

interface NavButtonProps {
    label: string;
    view: PuppetView;
    activeView: PuppetView;
    setActiveView: (view: PuppetView) => void;
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


interface PuppetStatusProps {
  puppet: Puppet;
  masterName: string;
  componentInventory: Component[];
  sideQuests: Quest[];
  companions: Companion[];
  npcs: NPC[];
  worldState: { [locationId: string]: string };
  loreEntries: LoreEntry[];
  loreSummaries: LoreSummary[];
}

const PuppetStatus: React.FC<PuppetStatusProps> = ({ puppet, componentInventory, sideQuests, companions, npcs, worldState, loreEntries, loreSummaries }) => {
  const [activeView, setActiveView] = useState<PuppetView>('stats');
  const hasWorldInfo = npcs.length > 0 || Object.keys(worldState).length > 0;


  const renderContent = () => {
    switch (activeView) {
        case 'stats':
            return (
                <div className="space-y-4 animate-fade-in">
                    <div className="ui-panel p-4">
                        <h3 className="font-cinzel font-bold text-lg text-red-500 mb-3 border-b-2 border-red-500/20 pb-2">Trạng Thái Cốt Lõi</h3>
                        <div className="space-y-3">
                            <StatBar value={puppet.stats.hp} maxValue={puppet.stats.maxHp} label="Độ Bền" color="bg-gradient-to-r from-red-600 to-red-500" glowColor="#f87171" />
                            <StatBar value={puppet.stats.aberrantEnergy} maxValue={puppet.stats.maxAberrantEnergy} label="Tà Năng" color="bg-gradient-to-r from-purple-600 to-purple-500" glowColor="#c084fc" tooltip="Năng lượng hỗn loạn chưa được tinh lọc. Nếu quá cao, nó có thể gây ra những đột biến không mong muốn và ảnh hưởng tiêu cực đến hoạt động của con rối." />
                            <StatBar value={puppet.stats.resonance} maxValue={100} label="Cộng Hưởng" color="bg-gradient-to-r from-slate-500 to-slate-400" glowColor="#94a3b8" tooltip="Mức độ đồng điệu giữa hành động của bạn và 'Nhân Cách' của con rối. Cộng hưởng cao giúp tăng hiệu quả chiến đấu và mở khóa những khả năng tiềm ẩn." />
                        </div>
                    </div>
                     <div className="ui-panel p-4">
                        <h3 className="font-cinzel font-bold text-lg text-red-500 mb-3 border-b-2 border-red-500/20 pb-2">Thuộc Tính Chiến Đấu</h3>
                       <div className="grid grid-cols-2 gap-3">
                            <StatDisplay label="Tấn Công" value={puppet.stats.attack} icon={<AttackIcon />} />
                            <StatDisplay label="Phòng Thủ" value={puppet.stats.defense} icon={<DefenseIcon />} />
                            <StatDisplay label="Tinh Hoa Cơ Khí" value={puppet.mechanicalEssence} icon={<EssenceIcon />} className="col-span-2" valueClassName="text-gray-100" />
                       </div>
                    </div>
                </div>
            );
        case 'skills':
            return (
                <div className="animate-fade-in">
                    <Section title="Kho Kỹ Năng">
                        <div className="space-y-2">
                            {puppet.abilities.map((ability, index) => (
                                <div key={index} className="text-sm text-gray-300 bg-black/30 p-3 border border-gray-700/50">
                                    <p className="font-semibold text-red-300">{ability.name}</p>
                                    <p className="italic text-gray-400 text-xs mt-1">{ability.description}</p>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
            );
        case 'quests':
            return (
                <div className="animate-fade-in">
                     <Section title="Nhật Ký Nhiệm Vụ" titleColor="text-yellow-400">
                        <div className="space-y-2">
                            {sideQuests.map(quest => (
                                <details key={quest.id} className={`text-sm bg-black/30 p-3 cursor-pointer transition-colors hover:bg-black/50 border-l-4 ${quest.status === 'active' ? 'border-red-500' : 'border-gray-600'}`}>
                                    <summary className={`font-semibold list-none focus:outline-none ${quest.status === 'active' ? 'text-red-300' : 'text-gray-500 line-through'}`}>{quest.title}</summary>
                                    <p className="italic text-gray-400 mt-2 border-t border-red-500/20 pt-2">{quest.description}</p>
                                </details>
                            ))}
                        </div>
                    </Section>
                </div>
            );
        case 'journal':
            return (
                <div className="animate-fade-in">
                     <Section title="Nhật Ký Tóm Tắt" titleColor="text-gray-300">
                        <div className="space-y-3">
                            {loreSummaries.map(entry => (
                                <div key={entry.id} className="text-sm bg-black/30 p-3 border-l-4 border-gray-500">
                                    <p className="font-semibold text-gray-300">Tóm tắt đến lượt {entry.turnNumber}:</p>
                                    <p className="italic text-gray-400 mt-1">{entry.summary}</p>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
            );
        case 'companions':
             return (
                <div className="animate-fade-in">
                     <Section title="Đồng Đội" titleColor="text-green-400">
                        <div className="space-y-2">
                            {companions.map(companion => (
                                <div key={companion.id} className="text-sm text-gray-300 bg-green-900/20 p-3 border border-green-500/20">
                                    <p className="font-semibold text-green-300">{companion.name}</p>
                                    <p className="italic text-gray-400 text-xs mt-1">{companion.description}</p>
                                     <div className="mt-2">
                                        <StatBar value={companion.stats.hp} maxValue={companion.stats.maxHp} label="HP" color="bg-green-600" glowColor="#34d399" />
                                    </div>
                                    <div className="flex gap-2 text-xs mt-2">
                                        <p>Tấn Công: {companion.stats.attack}</p>
                                        <p>Phòng Thủ: {companion.stats.defense}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
            );
         case 'world':
            return (
                <div className="animate-fade-in">
                    <Section title="Tình Hình Thế Giới" titleColor="text-gray-300">
                        {npcs.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-400 mb-2 border-b border-red-500/10 pb-1">Nhân Vật Đã Gặp</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                    {npcs.map(npc => (
                                        <div key={npc.id} className="text-sm bg-black/30 p-3 border border-gray-700/50 space-y-1">
                                            <p className="font-semibold text-gray-200">{npc.name} <span className="text-xs text-gray-500">({npc.relationship})</span></p>
                                            <p className="italic text-gray-400 text-xs">{npc.description}</p>
                                            <p className="text-xs text-gray-500">Vị trí: {npc.location}</p>
                                            {npc.goal && <p className="text-xs text-purple-300 bg-purple-900/20 p-1"><span className="font-semibold">Mục tiêu:</span> {npc.goal}</p>}
                                            {npc.knowledge && npc.knowledge.length > 0 && (
                                                <div className="text-xs text-gray-400 pt-1 border-t border-red-500/10">
                                                    <p className="font-semibold text-gray-300">Biết về bạn:</p>
                                                    <ul className="list-disc list-inside pl-2">
                                                        {npc.knowledge.map((fact, i) => <li key={i}>{fact}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {Object.keys(worldState).length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-400 mb-2 border-b border-red-500/10 pb-1">Trạng Thái Địa Điểm</h4>
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
                </div>
            );
        case 'lore':
            return (
                <div className="animate-fade-in">
                    <Section title="Tri Thức Đã Thu Thập" titleColor="text-gray-300">
                         <div className="space-y-2">
                            {loreEntries.map((entry) => (
                                <details key={entry.id} className="text-sm text-gray-300 bg-black/30 p-3 cursor-pointer transition-colors hover:bg-black/50 border border-gray-700/50">
                                    <summary className="font-semibold text-gray-200 list-none focus:outline-none">{entry.title}</summary>
                                    <p className="italic text-gray-400 mt-2 border-t border-red-500/20 pt-2">{entry.content}</p>
                                </details>
                            ))}
                        </div>
                    </Section>
                </div>
            );
        case 'components':
            return (
                <div className="animate-fade-in">
                    <Section title="Linh Kiện Đã Lắp" titleColor="text-red-400">
                         <div className="space-y-2">
                            {puppet.equippedComponents.length > 0 ? puppet.equippedComponents.map((component) => (
                                <div key={component.id} className="text-sm text-gray-300 bg-red-900/20 p-3 border border-red-500/20">
                                    <p className="font-semibold text-red-300">{component.name} <span className="text-xs text-gray-400">({component.type})</span></p>
                                    <p className="italic text-gray-400 text-xs mt-1">{component.description}</p>
                                </div>
                            )) : <p className="text-gray-500 italic text-center py-4">Chưa có linh kiện nào được lắp.</p>}
                        </div>
                    </Section>
                </div>
            );
        case 'mutations':
             return (
                <div className="animate-fade-in">
                    <Section title="Đột Biến Tà Năng" titleColor="text-purple-400">
                        <div className="space-y-2">
                            {puppet.mutations.length > 0 ? puppet.mutations.map((mutation) => (
                            <div key={mutation.id} className="text-sm text-gray-300 bg-purple-900/30 p-3 border border-purple-500/20">
                                <p className="font-semibold text-purple-300">{mutation.name}</p>
                                <p className="italic text-gray-400 text-xs mt-1">{mutation.description}</p>
                            </div>
                            )) : <p className="text-gray-500 italic text-center py-4">Con rối chưa có đột biến nào.</p>}
                        </div>
                    </Section>
                </div>
            );
        case 'memories':
            return (
                <div className="animate-fade-in">
                    <Section title="Ký Ức Cốt Lõi">
                         <div className="space-y-2">
                            {puppet.memoryFragments.length > 0 ? puppet.memoryFragments.map((fragment) => (
                                <details key={fragment.id} className="text-sm text-gray-300 bg-black/30 p-3 cursor-pointer transition-colors hover:bg-black/50 border border-gray-700/50">
                                    <summary className="font-semibold text-red-300 list-none focus:outline-none">{fragment.title}</summary>
                                    <p className="italic text-gray-400 mt-2 border-t border-red-500/20 pt-2">{fragment.text}</p>
                                </details>
                            )) : <p className="text-gray-500 italic text-center py-4">Chưa có ký ức cốt lõi nào được ghi lại.</p>}
                        </div>
                    </Section>
                </div>
            );
        case 'inventory':
            return (
                <div className="animate-fade-in">
                    <Section title="Kho Linh Kiện" titleColor="text-gray-400">
                         <div className="space-y-2">
                            {componentInventory.length > 0 ? componentInventory.map((component) => (
                                <div key={component.id} className="text-sm text-gray-300 bg-gray-900/30 p-3 border border-gray-500/20">
                                    <p className="font-semibold text-gray-300">{component.name} <span className="text-xs text-gray-500">({component.type})</span></p>
                                    <p className="italic text-gray-400 text-xs mt-1">{component.description}</p>
                                </div>
                            )) : <p className="text-gray-500 italic text-center py-4">Túi đồ của bạn trống rỗng.</p>}
                        </div>
                    </Section>
                </div>
            );
        case 'design':
            return (
                <div className="animate-fade-in">
                    <Section title="Bản Thiết Kế">
                        <div className="text-sm bg-black/30 p-3 space-y-2 border border-gray-700/50">
                            <p><span className="font-semibold text-gray-400">Phe Phái:</span> {puppet.phePhai}</p>
                            <p><span className="font-semibold text-gray-400">Lộ Trình:</span> {puppet.loTrinh}</p>
                            <p><span className="font-semibold text-gray-400">Trường Phái:</span> {puppet.truongPhai}</p>
                            <p><span className="font-semibold text-gray-400">Vật Liệu:</span> {puppet.material}</p>
                            <p className="pt-2 border-t border-red-500/10"><span className="font-semibold text-gray-400">Nhân Cách:</span> <span className="italic text-red-300">{puppet.persona}</span></p>
                        </div>
                    </Section>
                </div>
            );
        default:
            return null;
    }
  }

  return (
    <aside className="ui-panel p-4 h-full flex flex-col">
      <div className="text-center mb-4 flex-shrink-0">
        <h2 className="text-2xl font-cinzel text-red-400">{puppet.name}</h2>
        <p className="text-sm text-gray-400">{`Thứ Tự ${puppet.sequence}: ${puppet.sequenceName}`}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-4 border-y border-red-500/20 py-2 flex-shrink-0">
        <NavButton label="Trạng Thái" view="stats" activeView={activeView} setActiveView={setActiveView} />
        <NavButton label="Kỹ Năng" view="skills" activeView={activeView} setActiveView={setActiveView} />
        <NavButton label="Lắp Ráp" view="components" activeView={activeView} setActiveView={setActiveView} />
        <NavButton label="Túi Đồ" view="inventory" activeView={activeView} setActiveView={setActiveView} />
        <NavButton label="Nhiệm Vụ" view="quests" activeView={activeView} setActiveView={setActiveView} disabled={sideQuests.length === 0} />
        <NavButton label="Nhật Ký" view="journal" activeView={activeView} setActiveView={setActiveView} disabled={loreSummaries.length === 0} />
        <NavButton label="Đồng Đội" view="companions" activeView={activeView} setActiveView={setActiveView} disabled={companions.length === 0} />
        <NavButton label="Thế Giới" view="world" activeView={activeView} setActiveView={setActiveView} disabled={!hasWorldInfo} />
        <NavButton label="Tri Thức" view="lore" activeView={activeView} setActiveView={setActiveView} disabled={loreEntries.length === 0} />
        <NavButton label="Ký Ức" view="memories" activeView={activeView} setActiveView={setActiveView} disabled={puppet.memoryFragments.length === 0} />
        <NavButton label="Đột Biến" view="mutations" activeView={activeView} setActiveView={setActiveView} disabled={puppet.mutations.length === 0} />
        <NavButton label="Thiết Kế" view="design" activeView={activeView} setActiveView={setActiveView} />
      </div>
      
      <div className="mt-2 flex-grow overflow-y-auto pr-2">
        {renderContent()}
      </div>

    </aside>
  );
};

export default PuppetStatus;