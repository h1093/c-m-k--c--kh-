
import { generateContentWithSchema } from '../logic/aiService';
import { getInitialStoryPrompt, getNextStorySegmentPrompt } from './prompts/chroniclerPrompts';
import { getLoreSummaryPrompt } from './prompts/archivistPrompts';
import { storySegmentSchema, loreSummarySchema } from './schemas';
import type { StorySegment, Puppet, Clue, StartingScenario, ExplanationId, Quest, Companion, NPC, LoreEntry } from '../types';


export const generateInitialStory = async (puppetMasterName: string, biography: string, mainQuest: string, startingScenario: StartingScenario, customWorldPrompt: string | null): Promise<StorySegment> => {
    const prompt = getInitialStoryPrompt(puppetMasterName, biography, mainQuest, startingScenario, customWorldPrompt);
    return await generateContentWithSchema<StorySegment>(prompt, storySegmentSchema);
};

export const generateNextStorySegment = async (puppetMasterName: string, puppet: Puppet | null, history: StorySegment[], choice: string, knownClues: Clue[], mainQuest: string, sideQuests: Quest[], companions: Companion[], shownExplanations: ExplanationId[], startingScenario: StartingScenario, customWorldPrompt: string | null, npcs: NPC[], worldState: { [locationId: string]: string }, loreEntries: LoreEntry[]): Promise<StorySegment> => {
    const prompt = getNextStorySegmentPrompt(puppetMasterName, puppet, history, choice, knownClues, mainQuest, sideQuests, companions, shownExplanations, startingScenario, customWorldPrompt, npcs, worldState, loreEntries);
    return await generateContentWithSchema<StorySegment>(prompt, storySegmentSchema);
};

export const generateLoreSummary = async (history: StorySegment[]): Promise<string> => {
    // Summarize the last 5 segments
    const segmentsToSummarize = history.slice(-5);
    const prompt = getLoreSummaryPrompt(segmentsToSummarize);
    const result = await generateContentWithSchema<{ summary: string }>(prompt, loreSummarySchema);
    return result.summary;
};
