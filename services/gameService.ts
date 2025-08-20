

import { generateContentWithSchema } from './aiService';
import { getInitialStoryPrompt, getNextStorySegmentPrompt } from '../logic/prompts/chroniclerPrompts';
import { getCombatTurnPrompt } from '../logic/prompts/tacticianPrompts';
import { getWorkshopPrompt, getNewSequenceNamePrompt, getComponentInstallPrompt } from '../logic/prompts/artificerPrompts';
import { 
    storySegmentSchema, 
    combatTurnSchema, 
    workshopSchema, 
    sequenceNameSchema,
    componentInstallSchema
} from '../logic/schemas';

import type { Puppet, StorySegment, Clue, Enemy, CombatTurnResult, WorkshopData, StartingScenario, ExplanationId, UpgradeOption, Component, Quest, Companion, NPC, LoreEntry } from '../types';


export const generateInitialStory = async (puppetMasterName: string, biography: string, mainQuest: string, startingScenario: StartingScenario, customWorldPrompt: string | null): Promise<StorySegment> => {
    const prompt = getInitialStoryPrompt(puppetMasterName, biography, mainQuest, startingScenario, customWorldPrompt);
    return await generateContentWithSchema<StorySegment>(prompt, storySegmentSchema);
};

export const generateNextStorySegment = async (puppetMasterName: string, puppet: Puppet | null, history: StorySegment[], choice: string, knownClues: Clue[], mainQuest: string, sideQuests: Quest[], companions: Companion[], shownExplanations: ExplanationId[], startingScenario: StartingScenario, customWorldPrompt: string | null, npcs: NPC[], worldState: { [locationId: string]: string }, loreEntries: LoreEntry[]): Promise<StorySegment> => {
    const prompt = getNextStorySegmentPrompt(puppetMasterName, puppet, history, choice, knownClues, mainQuest, sideQuests, companions, shownExplanations, startingScenario, customWorldPrompt, npcs, worldState, loreEntries);
    return await generateContentWithSchema<StorySegment>(prompt, storySegmentSchema);
};

export const handleCombatTurn = async (puppet: Puppet, enemy: Enemy, companions: Companion[], playerAction: string, combatLog: string[], shownExplanations: ExplanationId[]): Promise<CombatTurnResult> => {
    const prompt = getCombatTurnPrompt(puppet, enemy, companions, playerAction, combatLog, shownExplanations);
    return await generateContentWithSchema<CombatTurnResult>(prompt, combatTurnSchema);
};

export const generateWorkshopOptions = async (puppet: Puppet, shownExplanations: ExplanationId[]): Promise<WorkshopData> => {
    const prompt = getWorkshopPrompt(puppet, shownExplanations);
    return await generateContentWithSchema<WorkshopData>(prompt, workshopSchema);
};

export const generateNewSequenceName = async (puppet: Puppet, newSequence: number): Promise<string> => {
     try {
        const prompt = getNewSequenceNamePrompt(puppet, newSequence);
        const result = await generateContentWithSchema<{ sequenceName: string }>(prompt, sequenceNameSchema);
        return result.sequenceName || `Thăng Tiến Bậc ${newSequence}`;
    } catch (error) {
        console.error("Lỗi khi tạo tên Thứ Tự:", error);
        return `Thăng Tiến Bậc ${newSequence}`; // Fallback
    }
};

export const installComponentOnPuppet = async (puppet: Puppet, component: Component): Promise<{ scene: string, updatedPuppet: Puppet }> => {
    const prompt = getComponentInstallPrompt(puppet, component);
    return await generateContentWithSchema<{ scene: string, updatedPuppet: Puppet }>(prompt, componentInstallSchema);
};