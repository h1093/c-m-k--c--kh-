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

    if (isLoading && !workshopData) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <LoadingSpinner />
                <p className="mt-4 text-red-400">Đang chuẩn bị xưởng...</p>
            </div>
        );
    }

    if (!workshopData) {
        return (
           <div className="flex flex-col items-center justify-center h-full">
               <p className="text-gray-400">Lỗi: Không có dữ liệu xưởng.</p>
               <div className="mt-8 text-center border-t border-red-500/20 pt-6">
                   <button onClick={onExit} className="ui-button bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6">
                       Thoát
                   </button>
                </div>
           </div>
       );
   }

    return (
        <div className="flex items-center justify-center h-full p-4 animate-fade-in">
            <div className="w-full max-w-4xl mx-auto ui-panel p-8">
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-cinzel text-red-600">Xưởng Chế Tác</h2>
                    <p className="text-gray-400 mt-2">Nơi những cỗ máy được tái sinh. Tinh hoa cần thiết: <span className="font-bold text-white">{upgradeCost}</span>. Hiện có: <span className="font-bold text-white">{puppet.mechanicalEssence}</span></p>
                </div>

                {error && <p className="text-red-400 text-center mb-4 bg-red-900/50 p-3 animate-pulse">{error}</p>}
                
                <p className="text-center text-gray-300 italic mb-8">{workshopData.scene}</p>
                
                <ExplanationDisplay explanation={workshopData.explanation} />
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <LoadingSpinner />
                        <p className="mt-4 text-red-400">Đang hiệu chỉnh Tâm Cơ Luân...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {/* Upgrade Options */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-cinzel text-red-400 border-b-2 border-red-500/20 pb-2">Tinh Luyện Tâm Cơ Luân</h3>
                            {workshopData.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => onUpgrade(option)}
                                    disabled={puppet.mechanicalEssence < upgradeCost || isLoading}
                                    className="w-full text-left ui-button bg-gray-800 border-gray-700 hover:bg-gray-700/80 disabled:opacity-50 disabled:cursor-not-allowed p-4"
                                >
                                    <p className="font-bold text-red-300">{option.name}</p>
                                    <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                                </button>
                            ))}
                        </div>

                        {/* Component Installation */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-cinzel text-red-400 border-b-2 border-red-500/20 pb-2">Lắp Ráp Linh Kiện</h3>
                            {inventory.length > 0 ? (
                                <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                                    {inventory.map(component => (
                                        <button
                                            key={component.id}
                                            onClick={() => onInstall(component)}
                                            disabled={isLoading}
                                            className="w-full text-left ui-button bg-gray-800 border-gray-700 hover:bg-gray-700/80 p-4 disabled:opacity-50"
                                        >
                                            <p className="font-bold text-white">{component.name} <span className="text-xs font-normal text-gray-500">[{component.type}]</span></p>
                                            <p className="text-sm text-gray-400 mt-1">{component.description}</p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic text-center pt-4">Không có linh kiện nào trong kho.</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-12 pt-8 border-t border-red-500/20 flex justify-end">
                    <button onClick={onExit} disabled={isLoading} className="ui-button bg-gray-700 border-gray-600 hover:bg-gray-600 py-3 px-8 text-lg font-cinzel disabled:opacity-50">
                        Rời Xưởng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkshopUI;
