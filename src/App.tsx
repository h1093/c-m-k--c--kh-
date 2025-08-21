import React from 'react';
import { GameStage } from './types';
import { useGameState } from './hooks/useGameState';
import CharacterCreation from './screens/CharacterCreation';
import LoadingSpinner from './components/UI/LoadingSpinner';
import CombatUI from './components/Combat/CombatUI';
import WorkshopUI from './components/Workshop/WorkshopUI';
import StartScreen from './screens/StartScreen';
import WorldCreation from './screens/WorldCreation';
import AdventureScreen from './screens/AdventureScreen';

const App: React.FC = () => {
    const {
        gameState, setGameState, startingScenario, saveMessage,
        loadGameState, handleCustomGameStart, handleCharacterCreation,
        handleChoice, handleCombatAction, handleEnterWorkshop, handleUpgrade,
        handleInstallComponent, handleExitWorkshop, restartGame, handleSaveGame, handleExitToMenu
    } = useGameState();

    const handleLoadGame = () => {
        if (!loadGameState()) {
            alert("Không thể tải game. File lưu có thể đã bị hỏng.");
        }
    };

    const renderContent = () => {
        const turnCount = gameState.storyHistory.length;
        switch (gameState.stage) {
            case GameStage.START_SCREEN:
                return <StartScreen onStart={() => setGameState(prev => ({ ...prev, stage: GameStage.CREATION, customWorldPrompt: null }))} onWorldCreation={() => setGameState(prev => ({ ...prev, stage: GameStage.WORLD_CREATION }))} onLoadGame={handleLoadGame} />;
            case GameStage.WORLD_CREATION:
                return <WorldCreation onStart={handleCustomGameStart} />;
            case GameStage.CREATION:
                return <CharacterCreation onStart={handleCharacterCreation} />;
            case GameStage.PLAYING:
            case GameStage.GAME_OVER:
                return <AdventureScreen gameState={gameState} startingScenario={startingScenario} onChoice={handleChoice} onEnterWorkshop={handleEnterWorkshop} onRestart={restartGame} onSaveGame={handleSaveGame} onExitToMenu={handleExitToMenu} turnCount={turnCount} apiCalls={gameState.apiCalls} />;
            case GameStage.COMBAT:
                if (!gameState.puppet || !gameState.enemy) {
                    return <AdventureScreen gameState={{...gameState, error: "Lỗi chiến đấu: Dữ liệu không hợp lệ."}} startingScenario={startingScenario} onChoice={handleChoice} onEnterWorkshop={handleEnterWorkshop} onRestart={restartGame} onSaveGame={handleSaveGame} onExitToMenu={handleExitToMenu} turnCount={turnCount} apiCalls={gameState.apiCalls} />;
                }
                return <CombatUI
                    {...gameState}
                    onAction={handleCombatAction}
                    onSaveGame={handleSaveGame}
                    onExitToMenu={handleExitToMenu}
                    turnCount={turnCount}
                    inventory={gameState.componentInventory}
                    masterName={gameState.puppetMasterName}
                />;
            case GameStage.WORKSHOP:
                if (!gameState.puppet) {
                    return <AdventureScreen gameState={{...gameState, error: "Lỗi xưởng: Không tìm thấy con rối."}} startingScenario={startingScenario} onChoice={handleChoice} onEnterWorkshop={handleEnterWorkshop} onRestart={restartGame} onSaveGame={handleSaveGame} onExitToMenu={handleExitToMenu} turnCount={turnCount} apiCalls={gameState.apiCalls} />;
                }
                return <WorkshopUI
                    puppet={gameState.puppet}
                    workshopData={gameState.workshopData}
                    inventory={gameState.componentInventory}
                    isLoading={gameState.isLoading}
                    error={gameState.error}
                    onUpgrade={handleUpgrade}
                    onInstall={handleInstallComponent}
                    onExit={handleExitWorkshop}
                />
            default:
                return <p>Trạng thái không xác định</p>;
        }
    };

    return (
        <main className="h-screen w-screen bg-black overflow-y-auto">
            <div className="h-full w-full">
                {gameState.isLoading && (gameState.stage === GameStage.PLAYING || gameState.stage === GameStage.CREATION) ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <LoadingSpinner />
                        <p className="mt-4 text-red-400">Các bánh răng của định mệnh đang quay...</p>
                    </div>
                ) : (
                    renderContent()
                )}
            </div>
            {saveMessage && <div className="save-toast font-cinzel">{saveMessage}</div>}
        </main>
    );
};

export default App;