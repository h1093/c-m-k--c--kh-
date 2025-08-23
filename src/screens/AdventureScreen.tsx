import React, { useState } from 'react';
import type { GameState, StartingScenario } from '../types';
import PuppetStatus from '../components/PC/PuppetStatus';
import PlayerStatus from '../components/PC/PlayerStatus';
import ClueJournal from '../components/Quest/ClueJournal';
import StoryDisplay from '../components/Story/StoryDisplay';
import ExplanationDisplay from '../components/UI/ExplanationDisplay';
import ChoiceButtons from '../components/Story/ChoiceButtons';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { GameStage } from '../types';

interface AdventureScreenProps {
    gameState: GameState;
    startingScenario: StartingScenario;
    onChoice: (choice: string) => void;
    onEnterWorkshop: () => void;
    onRestart: () => void;
    onSaveGame: () => void;
    onExitToMenu: () => void;
    onRetry: () => void;
    onUseItem: (itemId: string) => void;
    turnCount: number;
    apiCalls: number;
}

const AdventureScreen: React.FC<AdventureScreenProps> = ({ gameState, startingScenario, onChoice, onEnterWorkshop, onRestart, onSaveGame, onExitToMenu, onRetry, onUseItem, turnCount, apiCalls }) => {
    const [isStatusPanelVisible, setIsStatusPanelVisible] = useState(false);

    const StatusPanel = () => (
        <>
            {gameState.puppet
                ? <PuppetStatus
                    puppet={gameState.puppet}
                    masterName={gameState.puppetMasterName}
                    psyche={gameState.psyche}
                    maxPsyche={gameState.maxPsyche}
                    componentInventory={gameState.componentInventory}
                    itemInventory={gameState.inventory}
                    sideQuests={gameState.sideQuests}
                    companions={gameState.companions}
                    npcs={gameState.npcs}
                    worldState={gameState.worldState}
                    loreEntries={gameState.loreEntries}
                    loreSummaries={gameState.loreSummaries}
                    factionRelations={gameState.factionRelations}
                    apiCalls={apiCalls}
                    kimLenh={gameState.kimLenh}
                    dauAnDongThau={gameState.dauAnDongThau}
                    onUseItem={onUseItem}
                />
                : <PlayerStatus
                    name={gameState.puppetMasterName}
                    biography={gameState.puppetMasterBiography}
                    scenario={startingScenario}
                    psyche={gameState.psyche}
                    maxPsyche={gameState.maxPsyche}
                    sideQuests={gameState.sideQuests}
                    companions={gameState.companions}
                    npcs={gameState.npcs}
                    worldState={gameState.worldState}
                    loreEntries={gameState.loreEntries}
                    loreSummaries={gameState.loreSummaries}
                    factionRelations={gameState.factionRelations}
                    apiCalls={apiCalls}
                    kimLenh={gameState.kimLenh}
                    dauAnDongThau={gameState.dauAnDongThau}
                    inventory={gameState.inventory}
                />
            }
            {gameState.clues.length > 0 && <ClueJournal clues={gameState.clues} />}
        </>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-2 sm:p-4 md:p-6 h-full">
            {/* Desktop Status Panel */}
            <div className="hidden lg:block lg:w-[30rem] lg:flex-shrink-0 lg:h-full overflow-y-auto">
                <StatusPanel />
            </div>

            <div className="flex-grow ui-panel flex flex-col overflow-hidden">
                {/* Mobile Header & Status Toggle */}
                <div className="lg:hidden flex justify-between items-center p-4 border-b border-red-500/20 flex-shrink-0">
                    <h2 className="font-cinzel text-lg text-red-400 truncate pr-2">{gameState.puppet ? gameState.puppet.name : gameState.puppetMasterName}</h2>
                    <button onClick={() => setIsStatusPanelVisible(true)} className="ui-button px-4 py-1 text-sm flex-shrink-0">
                        Trạng Thái
                    </button>
                </div>

                <div className="p-4 sm:p-6 flex-grow overflow-y-auto">
                    {gameState.currentSegment?.worldEvent && (
                        <div className="mb-6 p-3 bg-gray-800/50 border-l-4 border-gray-500 text-gray-300 italic animate-fade-in">
                            <p><span className="font-bold not-italic text-gray-400">Trong khi đó...</span> {gameState.currentSegment.worldEvent}</p>
                        </div>
                    )}
                    <StoryDisplay segment={gameState.currentSegment} />
                    <ExplanationDisplay explanation={gameState.currentSegment?.explanation} />
                    {gameState.error && (
                        <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 text-center animate-fade-in">
                             <p className="text-red-400 animate-pulse">Lỗi: {gameState.error}</p>
                             <button onClick={onRetry} className="ui-button text-sm py-1 px-4 mt-3">
                                 Thử Lại
                             </button>
                         </div>
                    )}
                </div>

                <div className="p-4 sm:p-6 pt-0 flex-shrink-0">
                    <div className="mt-6">
                        {gameState.isLoading && gameState.stage !== GameStage.GAME_OVER ? (
                            <div className="flex flex-col items-center justify-center"><LoadingSpinner /><p className="mt-2 text-sm text-red-400">Đang hiệu chỉnh...</p></div>
                        ) : (
                            <ChoiceButtons segment={gameState.currentSegment} onChoice={onChoice} />
                        )}
                    </div>
                    <div className="mt-6 border-t border-red-500/20 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                         <span className="text-sm text-gray-500 font-mono order-last sm:order-first">Lượt: {turnCount}</span>
                         <div className="flex flex-col sm:flex-row items-center gap-4">
                            {gameState.puppet && gameState.puppet.sequence > 1 && (
                                <div className="relative group w-full sm:w-auto">
                                    <button onClick={onEnterWorkshop} disabled={gameState.puppet.mechanicalEssence < (100 * (10 - gameState.puppet.sequence))} className="w-full sm:w-auto ui-button py-2 px-4">
                                        Vào Xưởng (Cần {100 * (10 - gameState.puppet.sequence)} Tinh Hoa)
                                    </button>
                                    <span className="tooltip">Nơi bạn có thể dùng Tinh Hoa Cơ Khí để nâng cấp Thứ Tự và kỹ năng cho con rối.</span>
                                </div>
                            )}
                             {gameState.stage !== GameStage.GAME_OVER && (
                                 <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                    <button onClick={onSaveGame} className="w-full sm:w-auto ui-button py-2 px-3 text-sm bg-gray-800/80 border-gray-600 hover:bg-gray-700">Lưu</button>
                                    <button onClick={onExitToMenu} className="w-full sm:w-auto ui-button py-2 px-3 text-sm bg-gray-800/80 border-gray-600 hover:bg-gray-700">Thoát</button>
                                </div>
                             )}
                        </div>
                    </div>
                    {(gameState.currentSegment?.choices.length === 0 || gameState.stage === GameStage.GAME_OVER) && !gameState.isLoading && (
                        <div className="text-center mt-8">
                            <p className="text-red-500 font-cinzel text-xl mb-4">{gameState.stage === GameStage.GAME_OVER ? "Màn Kịch Đã Kết Thúc" : "Màn Kịch Cuối Cùng?"}</p>
                            <button onClick={onRestart} className="ui-button py-2 px-4">Bắt Đầu Câu Chuyện Mới</button>
                        </div>
                    )}
                </div>
            </div>

            {isStatusPanelVisible && (
                <div className="lg:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-50 p-4 flex flex-col animate-fade-in">
                    <div className="flex-grow overflow-y-auto"><StatusPanel /></div>
                    <div className="flex-shrink-0 text-center pt-4"><button onClick={() => setIsStatusPanelVisible(false)} className="ui-button px-8 py-2">Đóng</button></div>
                </div>
            )}
        </div>
    );
};

export default AdventureScreen;