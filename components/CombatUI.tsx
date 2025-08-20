import React, { useRef, useEffect } from 'react';
import type { Puppet, Enemy, Explanation, Component, Companion } from '../types';
import PuppetStatus from './PuppetStatus';
import LoadingSpinner from './LoadingSpinner';
import ExplanationDisplay from './ExplanationDisplay';

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
            className="bg-red-800/70 hover:bg-red-700 border border-red-600 text-white font-bold py-4 px-4 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait font-cinzel uppercase tracking-wider"
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


const CombatUI: React.FC<CombatUIProps> = ({ puppet, enemy, companions, combatLog, onAction, isLoading, masterName, explanation, inventory }) => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 h-full animate-fade-in">
            <div className="lg:w-[30rem] lg:flex-shrink-0 lg:h-full overflow-y-auto">
                <PuppetStatus 
                    puppet={puppet} 
                    masterName={masterName} 
                    componentInventory={inventory} 
                    sideQuests={[]} 
                    companions={companions} 
                />
            </div>
            <div className="flex-grow flex flex-col overflow-hidden">
                <div className="flex-grow overflow-y-auto pr-2 space-y-6">
                    <EnemyStatus enemy={enemy} />
                    <CompanionCombatStatus companions={companions} />
                    <CombatLog log={combatLog} />
                    <ExplanationDisplay explanation={explanation} />
                </div>
                <div className="mt-6 flex-shrink-0">
                    {isLoading 
                        ? <div className="flex flex-col items-center justify-center h-24"><LoadingSpinner /><p className="mt-2 text-sm text-red-400">Đối thủ đang tính toán...</p></div>
                        : <CombatActions onAction={onAction} puppet={puppet} isLoading={isLoading} />
                    }
                </div>
            </div>
        </div>
    );
};

export default CombatUI;