
import React, { useState, useRef, useEffect } from 'react';
import type { Puppet, Enemy, Explanation, Component, Companion, NPC, LoreEntry, LoreSummary, FactionRelations, Item, Quest } from '../../types';
import PuppetStatus from '../PC/PuppetStatus';
import LoadingSpinner from '../UI/LoadingSpinner';
import ExplanationDisplay from '../UI/ExplanationDisplay';

interface CombatUIProps {
    puppet: Puppet;
    enemy: Enemy;
    companions: Companion[];
    combatLog: string[];
    onAction: (action: string) => void;
    isLoading: boolean;
    masterName: string;
    explanation?: Explanation;
    inventory: Component[];
    itemInventory: Item[];
    sideQuests: Quest[];
    onUseItem: (itemId: string) => void;
    npcs: NPC[];
    worldState: { [locationId: string]: string };
    loreEntries: LoreEntry[];
    loreSummaries: LoreSummary[];
    factionRelations: FactionRelations;
    onSaveGame: () => void;
    onExitToMenu: () => void;
    onRetry: () => void;
    error: string | null;
    turnCount: number;
    apiCalls: number;
    kimLenh: number;
    dauAnDongThau: number;
    mentalShock: string | null;
    aberrantEnergyLeak: string | null;
}

const StatBar: React.FC<{ value: number; maxValue: number; color: string; glowColor: string; }> = ({ value, maxValue, color, glowColor }) => {
    const percentage = Math.max(0, (value / maxValue) * 100);
    return (
        <div className="w-full bg-black/50 h-5 p-0.5 border-2 border-gray-600 shadow-inner">
             <div className={`${color} h-full transition-all duration-500 relative flex items-center justify-center`} style={{ width: `${percentage}%` }}>
                 <div className="absolute inset-0 opacity-50" style={{ boxShadow: `0 0 10px 3px ${glowColor}` }}></div>
                 <span className="relative text-white text-xs font-bold z-10" style={{textShadow: '1px 1px 2px black'}}>{`${value}/${maxValue}`}</span>
            </div>
        </div>
    );
};

const EnemyStatus: React.FC<{ enemy: Enemy }> = ({ enemy }) => (
    <div className="ui-panel p-6 border-red-500/50">
        <div className="text-center mb-4">
            <h2 className="text-3xl font-cinzel text-red-400" style={{textShadow: '0 0 10px #f87171'}}>{enemy.name}</h2>
            <p className="text-sm text-gray-400 italic mt-1">{enemy.description}</p>
        </div>
        <div className="space-y-4">
             <div>
                <h3 className="font-bold text-lg text-red-500 mb-2 text-center uppercase tracking-wider">Tình Trạng</h3>
                <StatBar value={enemy.stats.hp} maxValue={enemy.stats.maxHp} color="bg-red-600" glowColor="#f87171" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-black/30 p-2 border border-gray-700/50">
                    <p className="text-sm text-gray-400 uppercase tracking-wider">Tấn Công</p>
                    <p className="text-xl font-bold font-cinzel text-red-400">{enemy.stats.attack}</p>
                </div>
                <div className="bg-black/30 p-2 border border-gray-700/50">
                    <p className="text-sm text-gray-400 uppercase tracking-wider">Phòng Thủ</p>
                    <p className="text-xl font-bold font-cinzel text-gray-400">{enemy.stats.defense}</p>
                </div>
            </div>
        </div>
    </div>
);

const CompanionCombatStatus: React.FC<{ companions: Companion[] }> = ({ companions }) => {
    if (companions.length === 0) return null;

    return (
        <div className="ui-panel p-4 border-green-500/30">
            <h3 className="font-cinzel text-xl text-green-400 text-center mb-3">Đồng Đội</h3>
            <div className="space-y-3">
                {companions.map(c => (
                    <div key={c.id}>
                        <p className="font-bold text-green-300 text-sm">{c.name}</p>
                        <StatBar value={c.stats.hp} maxValue={c.stats.maxHp} color="bg-green-600" glowColor="#34d399" />
                    </div>
                ))}
            </div>
        </div>
    );
}

const CombatActions: React.FC<{ onAction: (action: string) => void; puppet: Puppet; isLoading: boolean }> = ({ onAction, puppet, isLoading }) => (
    <div className="grid grid-cols-2 gap-3">
        <button
            onClick={() => onAction('Tấn công cơ bản')}
            disabled={isLoading}
            className="ui-button py-4 px-4"
        >
            Tấn Công
        </button>
        {puppet.abilities.map(ability => (
             <button
                key={ability.name}
                onClick={() => onAction(`Sử dụng kỹ năng: ${ability.name}`)}
                disabled={isLoading}
                className="bg-gray-800/70 hover:bg-gray-700 border border-gray-600 text-white font-bold py-4 px-4 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait font-cinzel uppercase tracking-wider"
            >
                {ability.name}
            </button>
        ))}
    </div>
);

const CombatLog: React.FC<{ log: string[] }> = ({ log }) => {
    const logEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [log]);

    return (
        <div className="ui-panel p-4 h-64 overflow-y-auto font-mono text-sm">
            <div className="space-y-2">
                {log.map((entry, index) => (
                    <p key={index} className={`text-gray-300 ${index === log.length - 1 ? 'animate-fade-in bg-red-500/10' : ''} p-1`}>
                        <span className="text-red-400 font-bold mr-2">&gt;</span>{entry}
                    </p>
                ))}
            </div>
            <div ref={logEndRef} />
        </div>
    );
};


const CombatUI: React.FC<CombatUIProps> = ({ puppet, enemy, companions, combatLog, onAction, isLoading, masterName, explanation, inventory, itemInventory, sideQuests, onUseItem, npcs, worldState, loreEntries, loreSummaries, factionRelations, onSaveGame, onExitToMenu, onRetry, error, turnCount, apiCalls, kimLenh, dauAnDongThau, mentalShock, aberrantEnergyLeak }) => {
    const [isStatusPanelVisible, setIsStatusPanelVisible] = useState(false);

    const StatusPanel = () => (
         <PuppetStatus 
            puppet={puppet} 
            masterName={masterName} 
            componentInventory={inventory} 
            itemInventory={itemInventory}
            sideQuests={sideQuests} 
            companions={companions} 
            npcs={npcs}
            worldState={worldState}
            loreEntries={loreEntries}
            loreSummaries={loreSummaries}
            factionRelations={factionRelations}
            apiCalls={apiCalls}
            kimLenh={kimLenh}
            dauAnDongThau={dauAnDongThau}
            onUseItem={onUseItem}
        />
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-2 sm:p-4 md:p-6 h-full animate-fade-in">
            {aberrantEnergyLeak && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-8 animate-fade-in-out-long backdrop-blur-sm">
                    <div className="text-center">
                        <p className="text-2xl font-cinzel text-purple-400 animate-glitch">{aberrantEnergyLeak}</p>
                    </div>
                </div>
            )}
            {/* Desktop Status Panel */}
            <div className="hidden lg:block lg:w-[30rem] lg:flex-shrink-0 lg:h-full overflow-y-auto">
                <StatusPanel />
            </div>

            <div className="flex-grow flex flex-col overflow-hidden h-full">
                 {/* Mobile Header & Status Toggle */}
                <div className="lg:hidden flex justify-between items-center p-4 border-b border-red-500/20 flex-shrink-0 bg-black/30 mb-4">
                    <div className="truncate pr-2">
                        <h2 className="font-cinzel text-lg text-red-400">{puppet.name}</h2>
                        <span className="text-xs text-gray-400 font-mono">Lượt: {turnCount}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <button onClick={onSaveGame} className="ui-button px-3 py-1 text-xs bg-gray-800/80 border-gray-600 hover:bg-gray-700 hover:border-gray-500">Lưu</button>
                        <button onClick={onExitToMenu} className="ui-button px-3 py-1 text-xs bg-gray-800/80 border-gray-600 hover:bg-gray-700 hover:border-gray-500">Thoát</button>
                        <button onClick={() => setIsStatusPanelVisible(true)} className="ui-button px-4 py-1 text-sm flex-shrink-0">
                            Trạng Thái
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto pr-2 space-y-6">
                    {mentalShock && (
                        <div className="p-3 text-center bg-gray-800/50 border-l-4 border-gray-600 animate-fade-in">
                            <p className="text-gray-300 italic">{mentalShock}</p>
                        </div>
                    )}
                    <EnemyStatus enemy={enemy} />
                    <CompanionCombatStatus companions={companions} />
                    <CombatLog log={combatLog} />
                    <ExplanationDisplay explanation={explanation} />
                    {error && (
                        <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 text-center animate-fade-in">
                             <p className="text-red-400 animate-pulse">Lỗi: {error}</p>
                             <button onClick={onRetry} className="ui-button text-sm py-1 px-4 mt-3">
                                 Thử Lại
                             </button>
                         </div>
                    )}
                </div>
                <div className="mt-auto pt-4 flex-shrink-0">
                    {isLoading 
                        ? <div className="flex flex-col items-center justify-center h-24"><LoadingSpinner /><p className="mt-2 text-sm text-red-400">Đối thủ đang tính toán...</p></div>
                        : (
                            <>
                                <div className="text-center mb-3 hidden lg:flex justify-between items-center">
                                     <span className="text-sm text-gray-500 font-mono">Lượt: {turnCount}</span>
                                    <div className="flex justify-center items-center gap-4">
                                        <button onClick={onSaveGame} className="ui-button py-1 px-4 text-sm bg-gray-800/80 border-gray-600 hover:bg-gray-700 hover:border-gray-500">Lưu Trận Đấu</button>
                                        <button onClick={onExitToMenu} className="ui-button py-1 px-4 text-sm bg-gray-800/80 border-gray-600 hover:bg-gray-700 hover:border-gray-500">Thoát ra Menu</button>
                                    </div>
                                </div>
                                <CombatActions onAction={onAction} puppet={puppet} isLoading={isLoading} />
                            </>
                        )
                    }
                </div>
            </div>

            {/* Mobile Status Panel (Modal) */}
            {isStatusPanelVisible && (
                <div className="lg:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-50 p-4 flex flex-col animate-fade-in">
                    <div className="flex-grow overflow-y-auto">
                         <StatusPanel />
                    </div>
                    <div className="flex-shrink-0 text-center pt-4">
                        <button onClick={() => setIsStatusPanelVisible(false)} className="ui-button px-8 py-2">
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CombatUI;