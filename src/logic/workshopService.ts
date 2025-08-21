import { generateContentWithSchema } from './aiService';
import { getWorkshopPrompt, getNewSequenceNamePrompt, getComponentInstallPrompt } from './prompts/artificerPrompts';
import { 
    workshopSchema, 
    sequenceNameSchema,
    componentInstallSchema
} from './schemas';
import type { WorkshopData, Puppet, ExplanationId, Component } from '../types';


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