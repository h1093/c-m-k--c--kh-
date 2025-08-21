import { useState, useCallback, useEffect } from 'react';
import { GameState, GameStage, UpgradeOption, StartingScenario, ExplanationId, Component, StorySegment, LoreSummary, Difficulty } from '../types';
import { generateInitialStory, generateNextStorySegment, generateLoreSummary } from '../logic/storyService';
import { handleCombatTurn } from '../logic/combatService';
import { generateWorkshopOptions, generateNewSequenceName, installComponentOnPuppet } from '../logic/workshopService';
import * as saveService from '../logic/saveService';
import { apiKeyManager } from '../logic/aiClient';

const getInitialStage = (): GameStage => {
    return apiKeyManager.getApiKey() ? GameStage.START_SCREEN : GameStage.API_SETUP;
};

const initialState: GameState = {
    stage: getInitialStage(),
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
    kimLenh: 0,
    dauAnDongThau: 0,
    factionRelations: {},
    difficulty: 'normal',
    apiCalls: 0,
};

export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>(initialState);
    const [startingScenario, setStartingScenario] = useState<StartingScenario>('complete');
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

     useEffect(() => {
        if (saveMessage) {
            const timer = setTimeout(() => setSaveMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [saveMessage]);

    const handleCustomGameStart = (prompt: string) => {
        setGameState(prev => ({
            ...initialState,
            stage: GameStage.CREATION, // Move to creation after world prompt
            customWorldPrompt: prompt,
        }));
    };

    const handleCharacterCreation = async (puppetMasterName: string, biography: string, mainQuest: string, scenario: StartingScenario, difficulty: Difficulty) => {
        setStartingScenario(scenario);
        setGameState(prev => ({ ...initialState, stage: GameStage.PLAYING, isLoading: true, puppetMasterName, puppetMasterBiography: biography, mainQuest, customWorldPrompt: prev.customWorldPrompt, difficulty, apiCalls: prev.apiCalls + 1 }));
        try {
            const initialSegment = await generateInitialStory(puppetMasterName, biography, mainQuest, scenario, gameState.customWorldPrompt, difficulty);

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
                kimLenh: prev.kimLenh + (initialSegment.kimLenhChange || 0),
                dauAnDongThau: prev.dauAnDongThau + (initialSegment.dauAnDongThauChange || 0),
                factionRelations: initialSegment.updatedFactionRelations ? { ...prev.factionRelations, ...initialSegment.updatedFactionRelations } : prev.factionRelations,
            }));
        } catch (error) {
            console.error(error);
            setGameState(prev => ({ ...prev, isLoading: false, error: error instanceof Error ? error.message : String(error) }));
        }
    };

    const handleChoice = useCallback(async (choice: string) => {
        if (!gameState.currentSegment) return;
        setGameState(prev => ({ ...prev, isLoading: true, error: null, apiCalls: prev.apiCalls + 1 }));
        try {
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
                gameState.factionRelations,
                gameState.difficulty
            );

            const newClues = [...gameState.clues];
            if (nextSegment.newClues) {
                nextSegment.newClues.forEach(newClue => { if (!newClues.find(c => c.id === newClue.id)) { newClues.push(newClue); } });
            }

            const newShownExplanations = new Set(gameState.shownExplanations);
            if (nextSegment.explanation) { newShownExplanations.add(nextSegment.explanation.id); }

            const newInventory = [...gameState.componentInventory, ...(nextSegment.newComponent ? [nextSegment.newComponent] : [])];
            
            const newSideQuests = [...gameState.sideQuests];
            if (nextSegment.newQuests) { nextSegment.newQuests.forEach(q => { if (!newSideQuests.find(sq => sq.id === q.id)) newSideQuests.push(q); }); }
            if (nextSegment.updatedQuests) {
                nextSegment.updatedQuests.forEach(uq => { const idx = newSideQuests.findIndex(q => q.id === uq.id); if (idx > -1) newSideQuests[idx].status = uq.status; });
            }

            const newCompanions = [...gameState.companions, ...(nextSegment.newCompanion ? [nextSegment.newCompanion] : [])];
            
            let updatedPuppet = nextSegment.updatedPuppet || gameState.puppet;
            if (updatedPuppet) {
                updatedPuppet.stats.resonance = Math.max(0, Math.min(100, updatedPuppet.stats.resonance + (nextSegment.resonanceChange || 0)));
                updatedPuppet.mechanicalEssence += nextSegment.essenceGained || 0;
                if (nextSegment.newMemoryFragment && !updatedPuppet.memoryFragments.find(f => f.id === nextSegment.newMemoryFragment!.id)) updatedPuppet.memoryFragments.push(nextSegment.newMemoryFragment);
                if (nextSegment.newMutation && !updatedPuppet.mutations.find(m => m.id === nextSegment.newMutation!.id)) updatedPuppet.mutations.push(nextSegment.newMutation);
            }

            const newWorldState = { ...gameState.worldState, ...nextSegment.updatedWorldState };
            
            const newNPCs = [...gameState.npcs];
            if (nextSegment.newOrUpdatedNPCs) {
                nextSegment.newOrUpdatedNPCs.forEach(updNPC => {
                    const idx = newNPCs.findIndex(n => n.id === updNPC.id);
                    if (idx > -1) newNPCs[idx] = updNPC; else newNPCs.push(updNPC);
                });
            }
            
            const newLoreEntries = [...gameState.loreEntries];
            if (nextSegment.newLoreEntries) {
                nextSegment.newLoreEntries.forEach(l => { if (!newLoreEntries.find(le => le.id === l.id)) newLoreEntries.push(l); });
            }

            const newHistory = [...gameState.storyHistory, nextSegment];
            let newLoreSummaries = [...gameState.loreSummaries];

            if (newHistory.length > 1 && newHistory.length % 5 === 0) {
                setGameState(prev => ({ ...prev, apiCalls: prev.apiCalls + 1 }));
                try {
                    const summaryText = await generateLoreSummary(newHistory);
                    newLoreSummaries.push({ id: `summary-${newHistory.length}`, turnNumber: newHistory.length, summary: summaryText });
                } catch(e) { console.error("Could not generate summary", e)}
            }
            
            const newFactionRelations = {...gameState.factionRelations};
            if (nextSegment.updatedFactionRelations) {
                for (const faction in nextSegment.updatedFactionRelations) {
                    newFactionRelations[faction] = (newFactionRelations[faction] || 0) + nextSegment.updatedFactionRelations[faction];
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
                kimLenh: prev.kimLenh + (nextSegment.kimLenhChange || 0),
                dauAnDongThau: prev.dauAnDongThau + (nextSegment.dauAnDongThauChange || 0),
                factionRelations: newFactionRelations,
            }));
        } catch (error) {
            console.error(error);
            setGameState(prev => ({ ...prev, isLoading: false, error: error instanceof Error ? error.message : String(error) }));
        }
    }, [gameState, startingScenario]);

    const handleCombatAction = async (action: string) => {
        if (!gameState.puppet || !gameState.enemy) return;
        setGameState(prev => ({ ...prev, isLoading: true, error: null, apiCalls: prev.apiCalls + 1 }));
        try {
            const result = await handleCombatTurn(gameState.puppet, gameState.enemy, gameState.companions, action, gameState.combatLog, Array.from(gameState.shownExplanations));
            const newLog = [...gameState.combatLog, result.combatLogEntry];
            if (result.isCombatOver) {
                if (result.outcome === 'win') {
                    const finalPuppetState = result.updatedPuppet;
                    finalPuppetState.mechanicalEssence += result.essenceGainedOnWin || 0;
                    const victorySegment: StorySegment = {
                        scene: `Sau một trận chiến ác liệt, ${gameState.enemy.name} cuối cùng đã bị đánh bại.`,
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
                        companions: result.updatedCompanions || prev.companions,
                        dauAnDongThau: prev.dauAnDongThau + (result.dauAnDongThauGainedOnWin || 0)
                    }));
                } else {
                    setGameState(prev => ({ ...prev, isLoading: false, stage: GameStage.GAME_OVER, error: `Bạn đã bị ${gameState.enemy?.name} đánh bại.` }));
                }
            } else {
                setGameState(prev => ({ ...prev, puppet: result.updatedPuppet, enemy: result.updatedEnemy, combatLog: newLog, isLoading: false, companions: result.updatedCompanions || prev.companions }));
            }
        } catch (error) {
            console.error(error);
            setGameState(prev => ({ ...prev, isLoading: false, error: error instanceof Error ? error.message : String(error) }));
        }
    };

    const handleEnterWorkshop = async () => {
        if (!gameState.puppet) return;
        setGameState(prev => ({ ...prev, stage: GameStage.WORKSHOP, isLoading: true, error: null, apiCalls: prev.apiCalls + 1 }));
        try {
            const workshopData = await generateWorkshopOptions(gameState.puppet, Array.from(gameState.shownExplanations));
            setGameState(prev => ({ ...prev, workshopData, isLoading: false }));
        } catch (error) {
            console.error(error);
            setGameState(prev => ({ ...prev, isLoading: false, error: error instanceof Error ? error.message : String(error) }));
        }
    };

    const handleUpgrade = async (option: UpgradeOption) => {
        if (!gameState.puppet) return;
        const upgradeCost = 100 * (10 - gameState.puppet.sequence);
        if (gameState.puppet.mechanicalEssence < upgradeCost) {
            setGameState(prev => ({ ...prev, error: "Không đủ Tinh Hoa Cơ Khí." }));
            return;
        }
        setGameState(prev => ({ ...prev, isLoading: true, error: null, apiCalls: prev.apiCalls + 1 }));
        try {
            let updatedPuppet = { ...gameState.puppet, stats: { ...gameState.puppet.stats }, abilities: [...gameState.puppet.abilities] };
            updatedPuppet.mechanicalEssence -= upgradeCost;
            updatedPuppet.sequence -= 1;
            updatedPuppet.sequenceName = await generateNewSequenceName(updatedPuppet, updatedPuppet.sequence);
            switch (option.type) {
                case 'skill': if (option.payload) { updatedPuppet.abilities.push(option.payload); updatedPuppet.abilityPool = updatedPuppet.abilityPool.slice(1); } break;
                case 'stat_attack': updatedPuppet.stats.attack += 2; break;
                case 'stat_defense': updatedPuppet.stats.defense += 2; break;
                case 'stat_hp': updatedPuppet.stats.maxHp += 5; updatedPuppet.stats.hp += 5; break;
                case 'purge': updatedPuppet.stats.aberrantEnergy = Math.max(0, updatedPuppet.stats.aberrantEnergy - 50); break;
            }
            setGameState(prev => ({ ...prev, puppet: updatedPuppet, stage: GameStage.PLAYING, workshopData: null, isLoading: false }));
        } catch (error) {
            console.error(error);
            setGameState(prev => ({ ...prev, isLoading: false, error: error instanceof Error ? error.message : String(error) }));
        }
    };

    const handleInstallComponent = async (component: Component) => {
        if (!gameState.puppet) return;
        setGameState(prev => ({ ...prev, isLoading: true, error: null, apiCalls: prev.apiCalls + 1 }));
        try {
            const { scene, updatedPuppet } = await installComponentOnPuppet(gameState.puppet, component);
            const newInventory = gameState.componentInventory.filter(c => c.id !== component.id);
            const installSegment: StorySegment = { scene, choices: ['Tiếp tục'], updatedPuppet };
            setGameState(prev => ({ ...prev, puppet: updatedPuppet, componentInventory: newInventory, stage: GameStage.PLAYING, workshopData: null, isLoading: false, currentSegment: installSegment, storyHistory: [...prev.storyHistory, installSegment] }));
        } catch (error) {
            console.error(error);
            setGameState(prev => ({ ...prev, isLoading: false, error: error instanceof Error ? error.message : String(error) }));
        }
    };

    const handleExitWorkshop = () => {
        setGameState(prev => ({ ...prev, stage: GameStage.PLAYING, workshopData: null, error: null }));
    };

    const restartGame = () => {
        setGameState(initialState);
    };

    const handleSaveGame = () => {
        if (saveService.saveGameState(gameState)) {
            setSaveMessage("Đã lưu tiến trình!");
        } else {
            setSaveMessage("Lưu thất bại!");
        }
    };

    const loadGameState = (): boolean => {
        const loadedState = saveService.loadGameState(initialState);
        if (loadedState) {
            setGameState(loadedState);
            // This is a bit of a hack, might need a better way to store scenario
            const isHuman = loadedState.puppet === null; 
            setStartingScenario(isHuman ? 'human' : 'complete');
            return true;
        }
        return false;
    };

    const handleExitToMenu = () => {
        setGameState(prev => ({ ...initialState, stage: getInitialStage(), customWorldPrompt: prev.customWorldPrompt }));
    };

    return {
        gameState,
        setGameState,
        startingScenario,
        saveMessage,
        loadGameState,
        handleCustomGameStart,
        handleCharacterCreation,
        handleChoice,
        handleCombatAction,
        handleEnterWorkshop,
        handleUpgrade,
        handleInstallComponent,
        handleExitWorkshop,
        restartGame,
        handleSaveGame,
        handleExitToMenu,
    };
};
