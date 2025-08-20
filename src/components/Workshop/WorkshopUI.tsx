import React from 'react';
import type { Puppet, WorkshopData, UpgradeOption, Explanation, Component } from '../../types';
import LoadingSpinner from '../UI/LoadingSpinner';
import ExplanationDisplay from '../UI/ExplanationDisplay';

interface WorkshopUIProps {
    puppet: Puppet;
    workshopData: WorkshopData | null;
    inventory: Component[];
    isLoading: boolean;
    error: string | null;
    onUpgrade: (option: UpgradeOption) => void;
    onInstall: (component: Component) => void;
    onExit: () => void;
}

const WorkshopUI: React.FC<WorkshopUIProps> = ({ puppet, workshopData, inventory, isLoading, error, onUpgrade, onInstall, onExit }) => {
    const upgradeCost = 100 * (10 - puppet.sequence);

    if (!workshopData && !isLoading) {
         return (
            <div className="flex flex-col items-center justify-center h-full">
                <p>Đang chờ lệnh...</p>
                 <div className="mt-8 text-center border-t border-red-500/20 pt-6">
                    <button onClick={onExit} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6">Thoát Xưởng</button>
                </div>
            </div>
        );
    }
    
    if (isLoading || !workshopData) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <LoadingSpinner />
                <p className="mt-4 text-red-400">Đang tinh chỉnh các bản thiết kế...</p>
            </div>
        );
    }
    
    const { scene, options, explanation } = workshopData;

    const equippedCounts = puppet.equippedComponents.reduce((acc, comp) => {
        const key = comp.type.toLowerCase() as keyof typeof acc;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, { core: 0, frame: 0, actuator: 0 });

    return (
        <div className="max-w-4xl mx-auto ui-panel p-8 animate-fade-in">
            <h2 className="text-4xl font-cinzel text-center text-red-500 mb-4" style={{textShadow: '0 0 10px #b91c1c'}}>Xưởng Chế Tác</h2>
            
            {error && <p className="text-red-400 text-center mb-4 bg-red-900/50 p-2 animate-pulse">{error}</p>}
            
            <div className="text-gray-300 leading-relaxed space-y-4 prose prose-invert max-w-none mb-8 text-center bg-black/30 p-4 border border-gray-700/50">
                 {scene.split('\n').filter(p => p.trim() !== '').map((p, index) => <p key={index}>{p}</p>)}
            </div>
            
            <ExplanationDisplay explanation={explanation} />
            
            {options.length > 0 && (
                <div className="mb-8">
                    <div className="text-center my-6">
                        <h3 className="text-2xl font-cinzel text-red-400">Tinh Luyện Tâm Cơ Luân</h3>
                        <p className="text-red-500">Nâng cấp từ Thứ Tự {puppet.sequence} lên {puppet.sequence - 1}</p>
                        <p className="text-gray-400">Chi phí: <span className="font-bold text-gray-200">{upgradeCost}</span> Tinh Hoa Cơ Khí</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => onUpgrade(option)}
                                className="w-full text-left bg-red-900/40 hover:bg-red-900/70 border border-red-800 text-white p-4 transition-all duration-300 transform hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-lg"
                            >
                                <p className="font-bold text-lg text-red-300">{option.name}</p>
                                <p className="text-gray-300">{option.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {inventory.length > 0 && (
                <div className="mt-8 pt-6 border-t border-red-500/30">
                     <h3 className="text-2xl font-cinzel text-center text-red-400 mb-4">Lắp Ráp Linh Kiện</h3>
                     <div className="grid grid-cols-3 gap-2 text-center mb-4 text-sm bg-black/30 p-2 border border-gray-700/50">
                        <p>Lõi: {equippedCounts.core}/{puppet.componentSlots.core}</p>
                        <p>Khung: {equippedCounts.frame}/{puppet.componentSlots.frame}</p>
                        <p>Truyền Động: {equippedCounts.actuator}/{puppet.componentSlots.actuator}</p>
                     </div>
                     <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {inventory.map(item => {
                             const slotKey = item.type.toLowerCase() as keyof typeof equippedCounts;
                             const isSlotAvailable = (equippedCounts[slotKey] || 0) < (puppet.componentSlots[slotKey] || 0);
                             return (
                                <div key={item.id} className="flex items-center justify-between bg-black/30 p-3 border border-gray-700/50">
                                    <div>
                                        <p className="font-bold text-red-300">{item.name} <span className="text-xs text-gray-400">({item.type})</span></p>
                                        <p className="text-sm text-gray-400">{item.description}</p>
                                    </div>
                                    <button 
                                        onClick={() => onInstall(item)}
                                        disabled={!isSlotAvailable}
                                        className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0 ml-4 ui-button"
                                    >
                                        Lắp
                                    </button>
                                </div>
                             )
                        })}
                     </div>
                </div>
            )}


            <div className="mt-8 text-center border-t border-red-500/20 pt-6">
                <button
                    onClick={onExit}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 transition-colors duration-300 shadow-lg"
                >
                    {options.length > 0 ? 'Để Sau' : 'Thoát Xưởng'}
                </button>
            </div>
        </div>
    );
};

export default WorkshopUI;
