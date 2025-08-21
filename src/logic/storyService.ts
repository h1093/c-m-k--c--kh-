
import { generateContentWithSchema } from './aiService';
import { getInitialStoryPrompt, getNextStorySegmentPrompt } from './prompts/chroniclerPrompts';
import { getLoreSummaryPrompt } from './prompts/archivistPrompts';
import { getBiographyGenerationPrompt } from './prompts/creatorPrompts';
import { storySegmentSchema, loreSummarySchema, biographySchema } from './schemas';
import type { StorySegment, Puppet, Clue, StartingScenario, ExplanationId, Quest, Companion, NPC, LoreEntry, FactionRelations, Difficulty } from '../types';


export const generateInitialStory = async (puppetMasterName: string, biography: string, mainQuest: string, startingScenario: StartingScenario, customWorldPrompt: string | null, difficulty: Difficulty): Promise<StorySegment> => {
    const prompt = getInitialStoryPrompt(puppetMasterName, biography, mainQuest, startingScenario, customWorldPrompt, difficulty);
    return await generateContentWithSchema<StorySegment>(prompt, storySegmentSchema);
};

export const generateNextStorySegment = async (puppetMasterName: string, puppet: Puppet | null, history: StorySegment[], choice: string, knownClues: Clue[], mainQuest: string, sideQuests: Quest[], companions: Companion[], shownExplanations: ExplanationId[], startingScenario: StartingScenario, customWorldPrompt: string | null, npcs: NPC[], worldState: { [locationId: string]: string }, loreEntries: LoreEntry[], factionRelations: FactionRelations, difficulty: Difficulty): Promise<StorySegment> => {
    const prompt = getNextStorySegmentPrompt(puppetMasterName, puppet, history, choice, knownClues, mainQuest, sideQuests, companions, shownExplanations, startingScenario, customWorldPrompt, npcs, worldState, loreEntries, factionRelations, difficulty);
    return await generateContentWithSchema<StorySegment>(prompt, storySegmentSchema);
};

export const generateLoreSummary = async (history: StorySegment[]): Promise<string> => {
    // Summarize the last 5 segments
    const segmentsToSummarize = history.slice(-5);
    const prompt = getLoreSummaryPrompt(segmentsToSummarize);
    const result = await generateContentWithSchema<{ summary: string }>(prompt, loreSummarySchema);
    return result.summary;
};

export const generateBiography = async (
    origin: string,
    incident: string,
    goal: string,
    startingScenario: StartingScenario
): Promise<{ origin: string; incident: string; goal: string }> => {
    const prompt = getBiographyGenerationPrompt(origin, incident, goal, startingScenario);
    return await generateContentWithSchema<{ origin: string; incident: string; goal: string }>(prompt, biographySchema);
};