
import { generateContentWithSchema } from './aiService';
import { getInitialStoryPrompt, getNextStorySegmentPrompt } from './prompts/chroniclerPrompts';
import { getLoreSummaryPrompt } from './prompts/archivistPrompts';
import { getBiographyGenerationPrompt } from './prompts/creatorPrompts';
import { storySegmentSchema, loreSummarySchema, biographySchema, npcMindSchema } from './schemas';
import type { StorySegment, Puppet, Clue, StartingScenario, ExplanationId, Quest, Companion, NPC, LoreEntry, FactionRelations, Difficulty } from '../types';


export const generateInitialStory = async (puppetMasterName: string, biography: string, mainQuest: string, startingScenario: StartingScenario, customWorldPrompt: string | null, difficulty: Difficulty): Promise<StorySegment> => {
    const prompt = getInitialStoryPrompt(puppetMasterName, biography, mainQuest, startingScenario, customWorldPrompt, difficulty);
    return await generateContentWithSchema<StorySegment>(prompt, storySegmentSchema);
};

export const generateNextStorySegment = async (puppetMasterName: string, puppet: Puppet | null, history: StorySegment[], choice: string, knownClues: Clue[], mainQuest: string, sideQuests: Quest[], companions: Companion[], shownExpanations: ExplanationId[], startingScenario: StartingScenario, customWorldPrompt: string | null, npcs: NPC[], worldState: { [locationId: string]: string }, loreEntries: LoreEntry[], factionRelations: FactionRelations, difficulty: Difficulty): Promise<StorySegment> => {
    const prompt = getNextStorySegmentPrompt(puppetMasterName, puppet, history, choice, knownClues, mainQuest, sideQuests, companions, shownExpanations, startingScenario, customWorldPrompt, npcs, worldState, loreEntries, factionRelations, difficulty);
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

const getNpcMindPrompt = (npcToUpdate: NPC, scene: string, playerChoice: string): string => {
    return `
        Bạn là một AI chuyên phân tích tâm lý và duy trì sự nhất quán cho các nhân vật NPC trong game 'Cấm Kỵ Cơ Khí'. Vai trò của bạn là đảm bảo NPC hành xử hợp lý, có chiều sâu và ghi nhớ các sự kiện quan trọng, giúp họ trở thành một cá thể độc lập.

        **Dữ Liệu Phân Tích:**

        1.  **Hồ Sơ NPC:**
            - Tên: ${npcToUpdate.name}
            - Mô tả cốt lõi: ${npcToUpdate.description}
            - Mối quan hệ hiện tại: ${npcToUpdate.relationship}
            - Mục tiêu: ${npcToUpdate.goal || "Chưa rõ"}
            - Tương tác quan trọng cuối cùng đã ghi nhớ: ${npcToUpdate.tuongTacCuoi || "Chưa có"}

        2.  **Bối Cảnh Hiện Tại:**
            - Lựa chọn của người chơi dẫn đến cảnh này: "${playerChoice}"
            - Diễn biến trong cảnh: "${scene}"

        **Nhiệm Vụ Của Bạn:**
        Dựa vào tất cả thông tin trên, hãy xác định trạng thái tâm lý và cập nhật ký ức của NPC.

        1.  **Xác định "Trạng Thái" (trangThai):**
            - NPC đang cảm thấy gì ngay lúc này? (ví dụ: sợ hãi, tò mò, giận dữ, biết ơn?)
            - Vai trò của họ trong phân cảnh này là gì? (ví dụ: người đưa tin, kẻ cản đường, nạn nhân?)
            - Dựa vào đó, hãy viết một mô tả ngắn gọn, súc tích cho trường 'trangThai'.

        2.  **Đánh giá "Tương Tác Cuối" (updatedTuongTacCuoi):**
            - Sự kiện trong phân cảnh này có "quan trọng" không? Một sự kiện được coi là quan trọng nếu nó:
                a. Thay đổi vĩnh viễn mối quan hệ giữa NPC và người chơi.
                b. Tiết lộ một bí mật lớn hoặc một phần cốt truyện chính.
                c. Thay đổi mạnh mẽ mục tiêu hoặc động lực của NPC.
                d. Người chơi đã cứu mạng hoặc gây hại nghiêm trọng cho NPC.
            - Nếu sự kiện là quan trọng, hãy viết một bản tóm tắt MỚI cho trường 'updatedTuongTacCuoi'.
            - Nếu sự kiện KHÔNG quan trọng (ví dụ: một cuộc trò chuyện thông thường, một giao dịch mua bán, hỏi đường), hãy trả về một **CHUỖI RỖNG** cho trường 'updatedTuongTacCuoi'.

        Hãy trả về kết quả trong schema JSON được yêu cầu.
    `;
};

export const generateNpcMindUpdate = async (npcToUpdate: NPC, scene: string, playerChoice: string): Promise<{ trangThai: string; updatedTuongTacCuoi: string }> => {
    const prompt = getNpcMindPrompt(npcToUpdate, scene, playerChoice);
    // This might fail if the response is empty, so we provide a fallback.
    try {
        const result = await generateContentWithSchema<{ trangThai: string; updatedTuongTacCuoi: string }>(prompt, npcMindSchema);
        return result || { trangThai: "Không xác định", updatedTuongTacCuoi: "" };
    } catch (error) {
        console.error(`Lỗi khi tạo cập nhật tâm trí cho NPC ${npcToUpdate.name}:`, error);
        return { trangThai: "Bị ảnh hưởng bởi sự cố bất thường", updatedTuongTacCuoi: "Một sự cố trong dòng thực tại đã xảy ra." };
    }
};
