
import { generateContentWithSchema } from './ai/aiService';
import { getCombatTurnPrompt } from './ai/prompts/tacticianPrompts';
import { combatTurnSchema } from './ai/schemas';
import type { CombatTurnResult, Puppet, Enemy, ExplanationId, Companion } from '../types';

export const handleCombatTurn = async (puppet: Puppet, enemy: Enemy, companions: Companion[], playerAction: string, combatLog: string[], shownExplanations: ExplanationId[]): Promise<CombatTurnResult> => {
    const prompt = getCombatTurnPrompt(puppet, enemy, companions, playerAction, combatLog, shownExplanations);
    return await generateContentWithSchema<CombatTurnResult>(prompt, combatTurnSchema);
};