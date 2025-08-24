

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
import ApiKeySetup from './screens/ApiKeySetup';
import CodexScreen from './screens/CodexScreen';

const App: React.FC = () => {
    const {
        gameState, setGameState, startingScenario, saveMessage, hint,
        loadGameState, handleCustomGameStart, handleCharacterCreation,
        handleChoice, handleCombatAction, handleEnterWorkshop, handleUpgrade,
        handleInstallComponent, handleExitWorkshop, restartGame, handleSaveGame, handleExitToMenu,
        handleRetry, handleUseItem, handleShowLoreScreen, handleExitLoreScreen,
        handleGoToApiSetup, handleApiKeyProvided
    } = useGameState();

    const handleLoadGame = () => {
        if (!loadGameState()) {
            alert("Không thể tải game. File lưu có thể đã bị hỏng.");
        }
    };

    const renderContent = () => {
        const turnCount = gameState.storyHistory.length;
        switch (gameState.stage) {
            case GameStage.API_SETUP:
                return <ApiKeySetup onKeyProvided={handleApiKeyProvided} />;
            case GameStage.START_SCREEN:
                return <StartScreen onStart={() => setGameState(prev => ({ ...prev, stage: GameStage.CREATION, customWorldPrompt: null }))} onWorldCreation={() => setGameState(prev => ({ ...prev, stage: GameStage.WORLD_CREATION }))} onLoadGame={handleLoadGame} onShowLore={handleShowLoreScreen} onGoToApiSetup={handleGoToApiSetup} />;
            case GameStage.LORE_SCREEN:
                return <CodexScreen onExit={handleExitLoreScreen} />;
            case GameStage.WORLD_CREATION:
                return <WorldCreation onStart={handleCustomGameStart} />;
            case GameStage.CREATION:
                return <CharacterCreation onStart={handleCharacterCreation} />;
            case GameStage.PLAYING:
            case GameStage.GAME_OVER:
                return <AdventureScreen gameState={gameState} startingScenario={startingScenario} onChoice={handleChoice} onEnterWorkshop={handleEnterWorkshop} onRestart={restartGame} onSaveGame={handleSaveGame} onExitToMenu={handleExitToMenu} turnCount={turnCount} apiCalls={gameState.apiCalls} onRetry={handleRetry} onUseItem={handleUseItem} onShowLore={handleShowLoreScreen} onGoToApiSetup={handleGoToApiSetup} />;
            case GameStage.COMBAT:
                if (!gameState.puppet || !gameState.enemy) {
                    return <AdventureScreen gameState={{...gameState, error: "Lỗi chiến đấu: Dữ liệu không hợp lệ."}} startingScenario={startingScenario} onChoice={handleChoice} onEnterWorkshop={handleEnterWorkshop} onRestart={restartGame} onSaveGame={handleSaveGame} onExitToMenu={handleExitToMenu} turnCount={turnCount} apiCalls={gameState.apiCalls} onRetry={handleRetry} onUseItem={handleUseItem} onShowLore={handleShowLoreScreen} onGoToApiSetup={handleGoToApiSetup} />;
                }
                return <CombatUI
                    {...gameState}
                    onAction={handleCombatAction}
                    onSaveGame={handleSaveGame}
                    onExitToMenu={handleExitToMenu}
                    onRetry={handleRetry}
                    turnCount={turnCount}
                    inventory={gameState.componentInventory}
                    itemInventory={gameState.inventory}
                    onUseItem={handleUseItem}
                    masterName={gameState.puppetMasterName}
                    onShowLore={handleShowLoreScreen}
                    onGoToApiSetup={handleGoToApiSetup}
                />;
            case GameStage.WORKSHOP:
                if (!gameState.puppet) {
                    return <AdventureScreen gameState={{...gameState, error: "Lỗi xưởng: Không tìm thấy con rối."}} startingScenario={startingScenario} onChoice={handleChoice} onEnterWorkshop={handleEnterWorkshop} onRestart={restartGame} onSaveGame={handleSaveGame} onExitToMenu={handleExitToMenu} turnCount={turnCount} apiCalls={gameState.apiCalls} onRetry={handleRetry} onUseItem={handleUseItem} onShowLore={handleShowLoreScreen} onGoToApiSetup={handleGoToApiSetup} />;
                }
                return <WorkshopUI
                    puppet={gameState.puppet}
                    workshopData={gameState.workshopData}
                    inventory={gameState.componentInventory}
                    itemInventory={gameState.inventory}
                    isLoading={gameState.isLoading}
                    error={gameState.error}
                    onUpgrade={handleUpgrade}
                    onInstall={handleInstallComponent}
                    onExit={handleExitWorkshop}
                    onRetry={handleRetry}
                />
            default:
                return <p>Trạng thái không xác định</p>;
        }
    };

    return (
        <main className="h-screen w-screen bg-black">
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
            {hint && <div className="hint-toast font-cinzel">{hint}</div>}
        </main>
    );
};

export default App;