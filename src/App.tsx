import React, { useState, useCallback, useEffect } from 'react';
import { GameState, GameStage, UpgradeOption, StartingScenario, ExplanationId, Component, StorySegment, LoreSummary } from './types';
import { generateInitialStory, generateNextStorySegment, generateLoreSummary } from './logic/storyService';
import { handleCombatTurn } from './logic/combatService';
import { generateWorkshopOptions, generateNewSequenceName, installComponentOnPuppet } from './logic/workshopService';
import { saveGameState, loadGameState } from './logic/saveService';
import CharacterCreation from './screens/CharacterCreation';
import LoadingSpinner from './components/UI/LoadingSpinner';
import CombatUI from './components/Combat/CombatUI';
import WorkshopUI from './components/Workshop/WorkshopUI';
import StartScreen from './screens/StartScreen';
import WorldCreation from './screens/WorldCreation';
import AdventureScreen from './screens/AdventureScreen';
import ApiKeySetup from './screens/ApiKeySetup';
import { initializeAI } from './logic/aiService';


const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(() => {
    try {
      // Prioritize localStorage, then fallback to environment variable
      return localStorage.getItem('gemini-api-key') || process.env.API_KEY || null;
    } catch (e) {
      console.error("Không thể truy cập localStorage:", e);
      return process.env.API_KEY || null;
    }
  });
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [isAiInitialized, setIsAiInitialized] = useState(false);

  const [gameState, setGameState] = useState<GameState>({
    stage: GameStage.START_SCREEN,
    puppetMasterName: '',
    puppetMasterBiography: '',
    mainQuest: '',
    puppet: null,
    enemy: null,
    storyHistory: [],
    currentSegment: null,
    combatLog: [],
    isLoading: false,
    error: null,
    clues: [],
    workshopData: null,
    shownExplanations: new Set<ExplanationId>(),
    componentInventory: [],
    customWorldPrompt: null,
    sideQuests: [],
    companions: [],
    npcs: [],
    worldState: {},
    loreEntries: [],
    loreSummaries: [],
    factionRelations: {},
    apiCalls: 0,
  });
  
  const [startingScenario, setStartingScenario] = useState<StartingScenario>('complete');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (apiKey && !isAiInitialized) {
      try {
        initializeAI(apiKey);
        setIsAiInitialized(true);
        setApiKeyError(null);
      } catch (e) {
        console.error("Không thể khởi tạo AI:", e);
        const errorMessage = e instanceof Error ? e.message : String(e);
        setApiKeyError(`Lỗi khởi tạo AI: ${errorMessage}. Vui lòng kiểm tra lại key.`);
        // Clear bad key
        try {
            localStorage.removeItem('gemini-api-key');
        } catch (localError) {
             console.error("Không thể xóa API key khỏi localStorage:", localError);
        }
        setApiKey(null);
        setIsAiInitialized(false);
      }
    }
  }, [apiKey, isAiInitialized]);

  const handleApiKeySubmit = (key: string) => {
    try {
      localStorage.setItem('gemini-api-key', key);
    } catch (e) {
      console.error("Không thể lưu API key vào localStorage:", e);
      // Don't block the app, just inform the user it won't be saved
      alert("Không thể lưu API key cho lần truy cập sau. Key sẽ chỉ có hiệu lực trong phiên này.");
    }
    setApiKey(key);
    setIsAiInitialized(false); // Force re-initialization on next effect run
  };

  const handleSaveGame = () => {
    if (saveGameState(gameState)) {
      setSaveMessage("Đã lưu tiến trình.");
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setSaveMessage("Lưu thất bại!");
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleLoadGame = () => {
    const loadedState = loadGameState();
    if (loadedState) {
        const savedApiKey = localStorage.getItem('gemini-api-key');
        if (savedApiKey) {
            setApiKey(savedApiKey); // This will trigger the useEffect for AI re-initialization
            setGameState(loadedState);
        } else {
            // This case is rare: savegame exists but key is gone
            setApiKeyError("Không tìm thấy API key đã lưu. Vui lòng nhập lại.");
            // Reset to a state that forces API key entry
            setApiKey(null);
            setIsAiInitialized(false);
            setGameState(prev => ({...prev, stage: GameStage.START_SCREEN})); 
        }
    } else {
        // Handle case where loading fails (e.g., corrupted data)
        alert("Không thể tải game. File lưu có thể đã bị hỏng.");
    }
  };


  const handleCustomGameStart = (prompt: string) => {
    setGameState(prev => ({
      ...prev,
      customWorldPrompt: prompt,
      stage: GameStage.CREATION,
    }));
  };

  const handleCharacterCreation = async (puppetMasterName: string, biography: string, mainQuest: string, scenario: StartingScenario) => {
    setStartingScenario(scenario);
    setGameState(prev => ({ ...prev, isLoading: true, puppetMasterName, puppetMasterBiography: biography, mainQuest, stage: GameStage.PLAYING }));
    try {
      const initialSegment = await generateInitialStory(puppetMasterName, biography, mainQuest, scenario, gameState.customWorldPrompt);
      
      const newShownExplanations = new Set<ExplanationId>();
      if (initialSegment.explanation) {
          newShownExplanations.add(initialSegment.explanation.id);
      }

      if (!initialSegment.updatedPuppet && scenario !== 'human') {
        throw new Error("Phân cảnh câu chuyện khởi đầu không cung cấp một con rối. Các bánh răng trong xưởng đã bị kẹt.");
      }
      setGameState(prev => ({
        ...prev,
        puppet: initialSegment.updatedPuppet || null,
        currentSegment: initialSegment,
        storyHistory: [initialSegment],
        isLoading: false,
        clues: initialSegment.newClues || [],
        shownExplanations: newShownExplanations,
        sideQuests: initialSegment.newQuests || [],
        companions: initialSegment.newCompanion ? [initialSegment.newCompanion] : [],
        npcs: initialSegment.newOrUpdatedNPCs || [],
        worldState: initialSegment.updatedWorldState || {},
        loreEntries: initialSegment.newLoreEntries || [],
        apiCalls: prev.apiCalls + 1,
      }));
    } catch (error) {
      console.error(error);
      setGameState(prev => ({ ...prev, isLoading: false, apiCalls: prev.apiCalls + 1, error: error instanceof Error ? error.message : String(error) }));
    }
  };

  const handleChoice = useCallback(async (choice: string) => {
    if (!gameState.currentSegment) return;
    setGameState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
        let apiCallCount = 1;
        const nextSegment = await generateNextStorySegment(
            gameState.puppetMasterName,
            gameState.puppet,
            gameState.storyHistory,
            choice,
            gameState.clues,
            gameState.mainQuest,
            gameState.sideQuests,
            gameState.companions,
            Array.from(gameState.shownExplanations),
            startingScenario,
            gameState.customWorldPrompt,
            gameState.npcs,
            gameState.worldState,
            gameState.loreEntries,
            gameState.factionRelations
        );

        const newClues = [...gameState.clues];
        if (nextSegment.newClues) {
            nextSegment.newClues.forEach(newClue => {
                if (!newClues.find(c => c.id === newClue.id)) {
                    newClues.push(newClue);
                }
            });
        }

        const newShownExplanations = new Set(gameState.shownExplanations);
        if (nextSegment.explanation && !newShownExplanations.has(nextSegment.explanation.id)) {
            newShownExplanations.add(nextSegment.explanation.id);
        }

        const newInventory = [...gameState.componentInventory];
        if (nextSegment.newComponent) {
            newInventory.push(nextSegment.newComponent);
        }
        
        const newSideQuests = [...gameState.sideQuests];
        if (nextSegment.newQuests) {
            nextSegment.newQuests.forEach(newQuest => {
                 if (!newSideQuests.find(q => q.id === newQuest.id)) {
                    newSideQuests.push(newQuest);
                }
            });
        }
        if (nextSegment.updatedQuests) {
            nextSegment.updatedQuests.forEach(updated => {
                const questIndex = newSideQuests.findIndex(q => q.id === updated.id);
                if (questIndex !== -1) {
                    newSideQuests[questIndex].status = updated.status;
                }
            });
        }

        const newCompanions = [...gameState.companions];
        if (nextSegment.newCompanion) {
            if (!newCompanions.find(c => c.id === nextSegment.newCompanion!.id)) {
                newCompanions.push(nextSegment.newCompanion);
            }
        }
        
        let updatedPuppet = nextSegment.updatedPuppet || gameState.puppet;
        
        if (updatedPuppet && nextSegment.resonanceChange) {
            updatedPuppet.stats.resonance = Math.max(0, Math.min(100, updatedPuppet.stats.resonance + nextSegment.resonanceChange));
        }
        if (updatedPuppet && nextSegment.essenceGained) {
            updatedPuppet.mechanicalEssence += nextSegment.essenceGained;
        }
        if (nextSegment.newMemoryFragment && updatedPuppet) {
            if (!updatedPuppet.memoryFragments.find(f => f.id === nextSegment.newMemoryFragment!.id)) {
                updatedPuppet.memoryFragments.push(nextSegment.newMemoryFragment);
            }
        }
        if (nextSegment.newMutation && updatedPuppet) {
             if (!updatedPuppet.mutations.find(m => m.id === nextSegment.newMutation!.id)) {
                updatedPuppet.mutations.push(nextSegment.newMutation);
            }
        }

        const newWorldState = { ...gameState.worldState, ...nextSegment.updatedWorldState };
        const newNPCs = [...gameState.npcs];
        if (nextSegment.newOrUpdatedNPCs) {
            nextSegment.newOrUpdatedNPCs.forEach(updatedNPC => {
                const existingIndex = newNPCs.findIndex(n => n.id === updatedNPC.id);
                if (existingIndex !== -1) {
                    newNPCs[existingIndex] = updatedNPC;
                } else {
                    newNPCs.push(updatedNPC);
                }
            });
        }
        
        const newLoreEntries = [...gameState.loreEntries];
        if (nextSegment.newLoreEntries) {
            nextSegment.newLoreEntries.forEach(newLore => {
                if (!newLoreEntries.find(l => l.id === newLore.id)) {
                    newLoreEntries.push(newLore);
                }
            });
        }

        const newFactionRelations = { ...gameState.factionRelations };
        if (nextSegment.updatedFactionRelations) {
            for (const faction in nextSegment.updatedFactionRelations) {
                const change = nextSegment.updatedFactionRelations[faction];
                const currentScore = newFactionRelations[faction] || 0;
                newFactionRelations[faction] = Math.max(-100, Math.min(100, currentScore + change));
            }
        }

        const newHistory = [...gameState.storyHistory, nextSegment];
        let newLoreSummaries = [...gameState.loreSummaries];

        if (newHistory.length > 1 && newHistory.length % 5 === 0) {
            apiCallCount++;
            try {
                const summaryText = await generateLoreSummary(newHistory);
                const newSummary: LoreSummary = {
                    id: `summary-${newHistory.length}`,
                    turnNumber: newHistory.length,
                    summary: summaryText,
                };
                newLoreSummaries.push(newSummary);
            } catch (summaryError) {
                console.error("Không thể tạo tóm tắt câu chuyện:", summaryError);
            }
        }

        setGameState(prev => ({
            ...prev,
            currentSegment: nextSegment,
            storyHistory: newHistory,
            puppet: updatedPuppet,
            enemy: nextSegment.enemy || null,
            stage: nextSegment.enemy ? GameStage.COMBAT : GameStage.PLAYING,
            isLoading: false,
            clues: newClues,
            shownExplanations: newShownExplanations,
            componentInventory: newInventory,
            sideQuests: newSideQuests,
            companions: newCompanions,
            worldState: newWorldState,
            npcs: newNPCs,
            loreEntries: newLoreEntries,
            loreSummaries: newLoreSummaries,
            factionRelations: newFactionRelations,
            apiCalls: prev.apiCalls + apiCallCount,
        }));
    } catch (error) {
        console.error(error);
        setGameState(prev => ({ ...prev, isLoading: false, apiCalls: prev.apiCalls + 1, error: error instanceof Error ? error.message : String(error) }));
    }
}, [gameState, startingScenario]);

const handleCombatAction = async (action: string) => {
    if (!gameState.puppet || !gameState.enemy) return;

    setGameState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
        const result = await handleCombatTurn(gameState.puppet, gameState.enemy, gameState.companions, action, gameState.combatLog, Array.from(gameState.shownExplanations));

        const newLog = [...gameState.combatLog, result.combatLogEntry];

        const newShownExplanations = new Set(gameState.shownExplanations);
        if (result.explanation && !newShownExplanations.has(result.explanation.id)) {
            newShownExplanations.add(result.explanation.id);
        }

        if (result.isCombatOver) {
            if (result.outcome === 'win') {
                const finalPuppetState = result.updatedPuppet;
                if(result.essenceGainedOnWin) {
                    finalPuppetState.mechanicalEssence += result.essenceGainedOnWin;
                }
                const victorySegment: StorySegment = {
                    scene: `Sau một trận chiến ác liệt, ${gameState.enemy.name} cuối cùng đã bị đánh bại. Bạn đã chiến thắng.`,
                    choices: ['Tiếp tục'],
                    updatedPuppet: finalPuppetState,
                    essenceGained: result.essenceGainedOnWin || 0,
                };
                setGameState(prev => ({
                    ...prev,
                    puppet: finalPuppetState,
                    enemy: null,
                    combatLog: [],
                    currentSegment: victorySegment,
                    storyHistory: [...prev.storyHistory, victorySegment],
                    stage: GameStage.PLAYING,
                    isLoading: false,
                    shownExplanations: newShownExplanations,
                    companions: result.updatedCompanions || prev.companions,
                    apiCalls: prev.apiCalls + 1,
                }));
            } else { // loss
                setGameState(prev => ({
                    ...prev,
                    isLoading: false,
                    stage: GameStage.GAME_OVER,
                    error: `Bạn đã bị ${gameState.enemy?.name} đánh bại.`,
                    apiCalls: prev.apiCalls + 1,
                }));
            }
        } else {
            setGameState(prev => ({
                ...prev,
                puppet: result.updatedPuppet,
                enemy: result.updatedEnemy,
                combatLog: newLog,
                isLoading: false,
                shownExplanations: newShownExplanations,
                companions: result.updatedCompanions || prev.companions,
                apiCalls: prev.apiCalls + 1,
            }));
        }
    } catch (error) {
        console.error(error);
        setGameState(prev => ({ ...prev, isLoading: false, apiCalls: prev.apiCalls + 1, error: error instanceof Error ? error.message : String(error) }));
    }
};

const handleEnterWorkshop = async () => {
    if (!gameState.puppet) return;
    setGameState(prev => ({ ...prev, stage: GameStage.WORKSHOP, isLoading: true, error: null }));
    try {
        const workshopData = await generateWorkshopOptions(gameState.puppet, Array.from(gameState.shownExplanations));
        const newShownExplanations = new Set(gameState.shownExplanations);
        if (workshopData.explanation && !newShownExplanations.has(workshopData.explanation.id)) {
            newShownExplanations.add(workshopData.explanation.id);
        }
        setGameState(prev => ({
            ...prev,
            workshopData,
            isLoading: false,
            shownExplanations: newShownExplanations,
            apiCalls: prev.apiCalls + 1,
        }));
    } catch (error) {
        console.error(error);
        setGameState(prev => ({ ...prev, isLoading: false, apiCalls: prev.apiCalls + 1, error: error instanceof Error ? error.message : String(error) }));
    }
};

const handleUpgrade = async (option: UpgradeOption) => {
    if (!gameState.puppet) return;

    const upgradeCost = 100 * (10 - gameState.puppet.sequence);
    if (gameState.puppet.mechanicalEssence < upgradeCost) {
        setGameState(prev => ({ ...prev, error: "Không đủ Tinh Hoa Cơ Khí." }));
        return;
    }
    
    setGameState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
        let updatedPuppet = { ...gameState.puppet, stats: { ...gameState.puppet.stats }, abilities: [...gameState.puppet.abilities] };
        updatedPuppet.mechanicalEssence -= upgradeCost;
        
        const newSequence = updatedPuppet.sequence - 1;
        updatedPuppet.sequence = newSequence;
        
        updatedPuppet.sequenceName = await generateNewSequenceName(updatedPuppet, newSequence);

        switch (option.type) {
            case 'skill':
                if (option.payload) {
                    updatedPuppet.abilities.push(option.payload);
                    updatedPuppet.abilityPool = updatedPuppet.abilityPool.slice(1);
                }
                break;
            case 'stat_attack':
                updatedPuppet.stats.attack += 2;
                break;
            case 'stat_defense':
                updatedPuppet.stats.defense += 2;
                break;
            case 'stat_hp':
                updatedPuppet.stats.maxHp += 5;
                updatedPuppet.stats.hp += 5;
                break;
            case 'purge':
                 updatedPuppet.stats.aberrantEnergy = Math.max(0, updatedPuppet.stats.aberrantEnergy - 50);
                 break;
        }

        setGameState(prev => ({
            ...prev,
            puppet: updatedPuppet,
            stage: GameStage.PLAYING,
            workshopData: null,
            isLoading: false,
            apiCalls: prev.apiCalls + 1,
        }));
    } catch (error) {
        console.error(error);
        setGameState(prev => ({ ...prev, isLoading: false, apiCalls: prev.apiCalls + 1, error: error instanceof Error ? error.message : String(error) }));
    }
};

const handleInstallComponent = async (component: Component) => {
    if (!gameState.puppet) return;

    setGameState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
        const { scene, updatedPuppet } = await installComponentOnPuppet(gameState.puppet, component);
        
        const newInventory = gameState.componentInventory.filter(c => c.id !== component.id);
        
        const installSegment: StorySegment = {
            scene,
            choices: ['Tiếp tục'],
            updatedPuppet,
        };

        setGameState(prev => ({
            ...prev,
            puppet: updatedPuppet,
            componentInventory: newInventory,
            stage: GameStage.PLAYING,
            workshopData: null,
            isLoading: false,
            currentSegment: installSegment,
            storyHistory: [...prev.storyHistory, installSegment],
            apiCalls: prev.apiCalls + 1,
        }));

    } catch (error) {
        console.error(error);
        setGameState(prev => ({ ...prev, isLoading: false, apiCalls: prev.apiCalls + 1, error: error instanceof Error ? error.message : String(error) }));
    }
};

const handleExitWorkshop = () => {
    setGameState(prev => ({...prev, stage: GameStage.PLAYING, workshopData: null, error: null}));
};

const restartGame = () => {
    setGameState({
        stage: GameStage.START_SCREEN,
        puppetMasterName: '',
        puppetMasterBiography: '',
        mainQuest: '',
        puppet: null,
        enemy: null,
        storyHistory: [],
        currentSegment: null,
        combatLog: [],
        isLoading: false,
        error: null,
        clues: [],
        workshopData: null,
        shownExplanations: new Set<ExplanationId>(),
        componentInventory: [],
        customWorldPrompt: null,
        sideQuests: [],
        companions: [],
        npcs: [],
        worldState: {},
        loreEntries: [],
        loreSummaries: [],
        factionRelations: {},
        apiCalls: 0,
    });
};

const handleExitToMenu = () => {
    if (window.confirm("Bạn có chắc chắn muốn thoát ra menu chính? Mọi tiến trình chưa được lưu sẽ bị mất.")) {
        restartGame();
    }
};

const renderContent = () => {
    const turnCount = gameState.storyHistory.length;

    switch (gameState.stage) {
      case GameStage.START_SCREEN:
        return <StartScreen onStart={() => setGameState(prev => ({ ...prev, stage: GameStage.CREATION, customWorldPrompt: null }))} onWorldCreation={() => setGameState(prev => ({...prev, stage: GameStage.WORLD_CREATION}))} onLoadGame={handleLoadGame} />;
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
            puppet={gameState.puppet} 
            enemy={gameState.enemy} 
            companions={gameState.companions}
            combatLog={gameState.combatLog} 
            onAction={handleCombatAction} 
            isLoading={gameState.isLoading} 
            masterName={gameState.puppetMasterName}
            explanation={gameState.currentSegment?.explanation}
            inventory={gameState.componentInventory}
            npcs={gameState.npcs}
            worldState={gameState.worldState}
            loreEntries={gameState.loreEntries}
            loreSummaries={gameState.loreSummaries}
            factionRelations={gameState.factionRelations}
            onSaveGame={handleSaveGame}
            onExitToMenu={handleExitToMenu}
            turnCount={turnCount}
            apiCalls={gameState.apiCalls}
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

if (!apiKey || !isAiInitialized) {
    return <ApiKeySetup onApiKeySubmit={handleApiKeySubmit} initialError={apiKeyError} />;
}

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