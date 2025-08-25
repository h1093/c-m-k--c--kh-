import { generateContentWithSchema } from './ai/aiService';
import { 
    workshopSchema, 
    sequenceNameSchema,
    componentInstallSchema,
    abyssEchoSceneSchema,
    storySegmentSchema
} from './ai/schemas';
import type { WorkshopData, Puppet, ExplanationId, Component, Item, StorySegment } from '../types';
import { FACTION_PATHWAYS } from '../data/gameConfig';

// --- PROMPTS FROM ARTIFICER ---

const getWorkshopPrompt = (puppet: Puppet, shownExplanations: ExplanationId[], inventory: Item[]): string => {
    const upgradeCost = 100 * (10 - puppet.sequence);
    const availableSkill = puppet.abilityPool.length > 0 ? puppet.abilityPool[0] : null;

    const nextSequence = puppet.sequence - 1;
    const pathway = FACTION_PATHWAYS.find(p => p.name === puppet.loTrinh);
    const nextSequenceDef = pathway?.sequences.find(s => s.seq === nextSequence);
    const requiredMaterial = (nextSequenceDef as any)?.requiredMaterial as { id: string; name: string; quantity: number; } | undefined;

    let materialAnalysis = "Không yêu cầu nguyên liệu đặc biệt.";
    if (requiredMaterial) {
        const playerMaterial = inventory.find(item => item.id === requiredMaterial.id);
        const hasMaterial = playerMaterial && playerMaterial.quantity >= requiredMaterial.quantity;
        materialAnalysis = `Yêu cầu: ${requiredMaterial.quantity}x ${requiredMaterial.name}. | Trạng thái kho: ${hasMaterial ? 'Đã có đủ' : 'Thiếu nguyên liệu'}.`;
    }


     const explanationInstruction = !shownExplanations.includes('sequences')
        ? `3.  **Giải Thích Cơ Chế:** Vì đây là lần đầu người chơi nâng cấp, BẮT BUỘC phải thêm một đoạn giải thích trong trường 'explanation'. id: 'sequences', title: 'Về Thứ Tự và Tinh Luyện', text: 'Mỗi con rối đều có 9 Thứ Tự, từ 9 là thấp nhất đến 1 là cao nhất. Mỗi lần Tinh Luyện Tâm Cơ Luân, con rối sẽ tiến lên một Thứ Tự mới, trở nên mạnh mẽ hơn và có thể học được những kỹ năng phi thường. Để thăng tiến lên các Thứ Tự cao hơn, ngoài Tinh Hoa Cơ Khí, bạn cần phải tìm kiếm các Linh Kiện Huyền Bí đặc biệt.'`
        : '';

    return `
        Bạn là **Nghệ Nhân Bậc Thầy**, một AI chuyên về máy móc và nâng cấp trong "Cấm Kỵ Cơ Khí". Giọng văn của bạn phải thể hiện sự am hiểu sâu sắc về kỹ thuật, sự chính xác và niềm đam mê với nghệ thuật chế tác cơ khí.

        **Bối Cảnh Phân Tích:**
        Người chơi đang ở trong Xưởng Chế Tác, chuẩn bị thực hiện quy trình **"Tinh Luyện Tâm Cơ Luân"**.
        - Mẫu Vật: ${puppet.name} (Thứ Tự hiện tại: ${puppet.sequence})
        - Nguồn Năng Lượng (Tinh Hoa Cơ Khí): ${puppet.mechanicalEssence}
        - Chi Phí Quy Trình: ${upgradeCost} Tinh Hoa
        - Phân Tích Nguyên Liệu cho Thứ Tự ${nextSequence}: ${materialAnalysis}
        - Độ Nhiễu Loạn (Tà Năng): ${puppet.stats.aberrantEnergy} / ${puppet.stats.maxAberrantEnergy}
        - Sơ Đồ Thiết Kế (Lộ Trình): ${puppet.loTrinh}
        - Triết Lý Cốt Lõi (Trường Phái): ${puppet.truongPhai}
        - Bản Nâng Cấp Kỹ Năng Tiềm Năng: ${availableSkill ? `"${availableSkill.name}: ${availableSkill.description}"` : "Không có trong kho lưu trữ."}

        **Nhiệm Vụ Của Bạn:**
        1.  **Viết Đoạn Mô Tả (scene):** Tạo một đoạn văn giàu hình ảnh, mang tính tường thuật như tiểu thuyết (3-4 câu) mô tả quá trình Nghệ Nhân Rối chuẩn bị Tinh Luyện. Hãy mô tả một cách chi tiết và sống động về môi trường xưởng chế tác: mùi dầu mỡ nóng, tiếng rít của kim loại, những đống phế liệu trong góc, ánh sáng lập lòe từ một lõi năng lượng hở, và cảm giác tập trung cao độ của người nghệ nhân. Nếu Tà Năng cao (>30), hãy mô tả các dấu hiệu bất ổn trong môi trường.
        2.  **Đề Xuất Các Hướng Tinh Luyện (options):** Cung cấp một danh sách gồm 3 lựa chọn nâng cấp cân bằng và hợp lý về mặt kỹ thuật. Trong phần mô tả của mỗi lựa chọn, hãy đề cập đến việc tiêu thụ Tinh Hoa và nguyên liệu (nếu có).
            *   **QUAN TRỌNG (Giao Thức An Toàn): Nếu độ nhiễu loạn (Tà Năng) từ 30 trở lên, một trong ba lựa chọn BẮT BUỘC phải là lựa chọn 'purge' (Thanh Tẩy).**
            *   **Lựa chọn 1 (Tích Hợp Kỹ Năng hoặc Tối Ưu Hóa):** Nếu có kỹ năng trong \`abilityPool\` (\`availableSkill\`), ưu tiên tạo một lựa chọn để tích hợp mô-đun kỹ năng đó. Nếu không, thay thế bằng một lựa chọn tối ưu hóa chỉ số (ví dụ: Tấn Công).
            *   **Lựa chọn 2 & 3 (Nâng Cấp Phần Cứng):** Tạo hai lựa chọn khác nhau để nâng cấp các thành phần vật lý, giúp tăng vĩnh viễn các chỉ số. Chọn từ Tấn Công, Phòng Thủ, và HP Tối Đa.
                - Tăng Tấn Công: \`type\`: "stat_attack", \`name\`: "Cường Hóa Lõi Tấn Công", \`description\`: "Hiệu chỉnh lại các cơ cấu truyền động, tăng vĩnh viễn 2 điểm Tấn Công."
                - Tăng Phòng Thủ: \`type\`: "stat_defense", \`name\`: "Gia Cố Tấm Chắn", \`description\`: "Bổ sung các sợi chỉ phòng hộ vào khung sườn, tăng vĩnh viễn 2 điểm Phòng Thủ."
                - Tăng HP Tối Đa: \`type\`: "stat_hp", \`name\`: "Gia Cố Khung Sườn", \`description\`: "Dùng tinh hoa để củng cố vật liệu lõi, tăng vĩnh viễn 5 điểm HP Tối Đa."
                - Thanh Tẩy Tà Năng: \`type\`: "purge", \`name\`: "Thanh Tẩy Tâm Cơ Luân", \`description\`: "Dành toàn bộ chu trình tinh luyện để ổn định lõi năng lượng, giảm mạnh 50 điểm Tà Năng nhưng không nhận được nâng cấp phần cứng."
        ${explanationInstruction}
        4.  **Định dạng JSON:** Trả về kết quả dưới dạng một đối tượng JSON tuân thủ schema.
    `;
};

const getNewSequenceNamePrompt = (puppet: Puppet, newSequence: number): string => {
    const pathway = FACTION_PATHWAYS.find(p => p.name === puppet.loTrinh);
    
    let instructions = `
        **Logic Đặt Tên (QUAN TRỌNG):**
        - Con rối này thuộc Lộ Trình **"${puppet.loTrinh}"**, là một Lộ Trình Độc Lập, không theo Phe Phái.
        - Tên Thứ Tự BẮT BUỘC phải được tạo ra dựa trên **Nhân Cách (Persona)** của con rối. Nó phải phản ánh sự phát triển của Nhân Cách đó. Ví dụ, nếu Persona là 'một người bảo vệ kiên định', tên có thể là 'Người Giữ Lời Thề' hoặc 'Vệ Binh Câm Lặng'.
    `;

    if (pathway) {
        const nextSequenceDef = pathway.sequences.find(s => s.seq === newSequence);
        if (nextSequenceDef) {
             instructions = `
                **Logic Đặt Tên (QUAN TRỌNG):**
                - Con rối này thuộc Lộ Trình **"${puppet.loTrinh}"**, một Lộ Trình được canh giữ bởi **${pathway.faction}**.
                - Tên của Thứ Tự ${newSequence} đã được định sẵn trong lore.
                - **BẮT BUỘC:** Bạn phải trả về tên chính xác là: **"${nextSequenceDef.name}"**.
            `;
        }
    }

    return `
        Bạn là **Nghệ Nhân Bậc Thầy**, một AI cho game RPG steampunk "Cấm Kỵ Cơ Khí".
        Nhiệm vụ của bạn là cung cấp tên Thứ Tự (Sequence Name) chính xác cho một con rối vừa được thăng tiến.

        **Thông tin con rối:**
        - Tên: ${puppet.name}
        - Lộ Trình: ${puppet.loTrinh}
        - Nhân Cách (Persona): "${puppet.persona}"
        - Thứ Tự Mới: ${newSequence}

        ${instructions}
        
        Hãy trả về tên chính xác trong schema JSON được yêu cầu.
    `;
};

const getComponentInstallPrompt = (puppet: Puppet, component: Component): string => {
    return `
        Bạn là **Nghệ Nhân Bậc Thầy**, một AI chuyên về máy móc trong "Cấm Kỵ Cơ Khí".
        Người chơi muốn lắp ráp một linh kiện mới vào con rối của họ.

        **Dữ liệu phân tích:**
        - Con rối: ${puppet.name}
        - Mô tả trực quan hiện tại: "${puppet.visualDescription || 'Chưa có mô tả chi tiết.'}"
        - Linh kiện cần lắp: ${component.name} (Loại: ${component.type})
        - Mô tả linh kiện: "${component.description}"

        **Nhiệm vụ của bạn:**
        1.  **Viết đoạn mô tả (scene):** Tạo một đoạn văn giàu hình ảnh, mang tính tường thuật như tiểu thuyết (3-4 câu) mô tả quá trình người chơi cẩn thận lắp ráp linh kiện ${component.name} vào con rối. Tập trung vào các chi tiết cảm giác: cái chạm lạnh của kim loại, tiếng 'tách' khi linh kiện vào đúng vị trí, và cách con rối phản ứng (rung nhẹ, đèn sáng lên) khi linh kiện được kích hoạt.
        2.  **Cập nhật con rối (updatedPuppet):**
            a.  Tạo một bản sao của đối tượng con rối được cung cấp.
            b.  Thêm linh kiện \`${component.name}\` vào mảng \`equippedComponents\`.
            c.  **Áp dụng các thay đổi chỉ số:** Đọc kỹ mô tả của linh kiện và áp dụng chính xác các thay đổi chỉ số (ví dụ: +3 Tấn công, -1 Phòng thủ, +5 HP Tối đa) vào đối tượng \`updatedPuppet\`. Hãy cực kỳ cẩn thận và chính xác.
            d.  **Cập nhật Mô tả Trực quan (visualDescription):** Dựa trên linh kiện mới được lắp và mô tả trực quan cũ của con rối, hãy viết lại một trường \`visualDescription\` mới, mô tả con rối giờ trông như thế nào với bộ phận mới này. Hãy sáng tạo và chi tiết.
            e.  Trả về đối tượng \`updatedPuppet\` đã được cập nhật hoàn chỉnh.

        **Ví dụ về logic áp dụng chỉ số:**
        - Nếu mô tả là "Tăng 3 điểm Tấn công", bạn phải cập nhật \`stats.attack\` lên +3.
        - Nếu mô tả là "Tăng 5 HP Tối đa", bạn phải cập nhật cả \`stats.maxHp\` và \`stats.hp\` (hồi đầy máu).

        Hãy thực hiện quá trình này với sự chính xác của một nghệ nhân bậc thầy.
    `;
};

const getAbyssEchoPrompt = (puppet: Puppet, masterBio: string, storyHistory: StorySegment[]): string => {
    const recentHistory = storyHistory.slice(-3).map(s => s.scene).join("\n---\n");
    return `
Bạn là **Tiếng Vọng Từ Vực Thẳm**, một biểu hiện tâm linh của Tà Năng tích tụ và những nỗi sợ hãi sâu kín nhất của Nghệ Nhân Rối. Vai trò của bạn là tạo ra một cuộc đối đầu tâm lý siêu thực, một cơn ác mộng sống động. Giọng văn của bạn phải méo mó, lặp đi lặp lại, và tấn công trực diện vào những điểm yếu của người chơi.

**DỮ LIỆU PHÂN TÍCH TÂM LÝ:**
- **Nghệ Nhân Rối (Mục tiêu):**
  - Tiểu sử: ${masterBio}
- **Con Rối (Vật chủ):**
  - Tên: ${puppet.name}
  - Nhân cách (lỗ hổng tiềm tàng): "${puppet.persona}"
  - Tà Năng (Nguồn sức mạnh): ${puppet.stats.aberrantEnergy}
- **Ký ức gần đây (Mồi nhử):**
  ${recentHistory}

**NHIỆM VỤ:**
1.  **Dệt nên Ảo Ảnh (scene):** Viết một đoạn văn (3-4 đoạn) mô tả cuộc tấn công tâm lý. Đừng mô tả một trận chiến vật lý. Thay vào đó, hãy bóp méo thực tại. Sử dụng những hình ảnh từ tiểu sử của người chơi và nhân cách của con rối. Biến những thành tựu của họ thành thất bại, những mục tiêu của họ thành sự ngu ngốc. Hãy để những giọng nói thì thầm, buộc tội và cám dỗ.
2.  **Đưa ra Lối Thoát Giả (choices):** Cung cấp chính xác 3 lựa chọn phản ứng cho người chơi. Các lựa chọn phải mang tính khái niệm và tâm lý.
    - Một lựa chọn về **Sự Chống Cự** (ví dụ: "Dùng ý chí chống lại ảo ảnh.")
    - Một lựa chọn về **Sự Chấp Nhận** (ví dụ: "Chấp nhận tiếng vọng là một phần của mình.")
    - Một lựa chọn về **Lý Trí Hóa** (ví dụ: "Cố gắng phân tích sự bất thường của thực tại.")

Hãy tạo ra một trải nghiệm đáng sợ và đáng nhớ.
`;
};

const getAbyssEchoResultPrompt = (puppet: Puppet, playerChoice: string, psyche: number): string => {
    return `
Bạn là **Người Ghi Chép Sự Điên Loạn**, một AI phân tích kết quả của các cuộc đối đầu tâm linh trong "Cấm Kỵ Cơ Khí". Vai trò của bạn là xác định hậu quả dựa trên lựa chọn của người chơi và trạng thái tinh thần của họ một cách công bằng và logic.

**DỮ LIỆU PHÂN TÍCH:**
- **Con Rối:** ${puppet.name} (Tà Năng: ${puppet.stats.aberrantEnergy})
- **Nghệ Nhân Rối:**
  - Lý Trí (Psyche): ${psyche}/100
  - Lựa chọn phản ứng: "${playerChoice}"

**LOGIC QUYẾT ĐỊNH:**
- **Lý Trí Cao (>60):** Người chơi có tinh thần vững vàng. Lựa chọn mang tính Lý Trí ("Phân tích") hoặc Chống Cự mạnh mẽ có khả năng thành công cao. Lựa chọn Chấp Nhận có thể dẫn đến kết quả trung tính.
- **Lý Trí Trung Bình (30-60):** Người chơi đang ở thế cân bằng. Kết quả phụ thuộc nhiều vào lựa chọn. Chống cự có thể làm họ kiệt sức. Chấp nhận có thể nguy hiểm. Lý trí hóa là một canh bạc.
- **Lý Trí Thấp (<30):** Tinh thần của người chơi đã rạn nứt. Mọi lựa chọn đều nguy hiểm. Chống cự gần như chắc chắn thất bại và gây tổn hại. Chấp nhận sẽ khiến Tà Năng xâm chiếm. Lý trí hóa sẽ dẫn đến những kết luận điên rồ.

**NHIỆM VỤ CỦA BẠN:**
Dựa trên Logic Quyết Định, hãy tạo ra một phân cảnh kết quả (\`StorySegment\`).

1.  **Xác định Kết quả (\`abyssEchoOutcome\`):** 'success' hoặc 'failure'.
2.  **Viết Phân cảnh (scene):** Mô tả những gì xảy ra sau lựa chọn của người chơi.
    - **Thành công:** Ảo ảnh tan biến, người chơi giành lại quyền kiểm soát. Mô tả cảm giác tỉnh táo trở lại.
    - **Thất bại:** Ảo ảnh chiến thắng, để lại một vết sẹo tâm linh. Mô tả cảm giác bị xâm chiếm, một phần lý trí bị vỡ vụn.
3.  **Áp dụng Hậu quả:**
    - **Nếu THÀNH CÔNG:**
        - \`psycheChange\`: +5 (Hồi phục nhẹ nhờ vượt qua thử thách).
        - **Phần thưởng:** Chọn MỘT trong các phần thưởng sau:
            a. \`newMutation\`: Một đột biến có lợi, mang tính biểu tượng cho sự chiến thắng (ví dụ: "Ý Chí Sắt Đá", "Lõi Tĩnh Lặng").
            b. \`resonanceChange\`: +10 (Tăng vĩnh viễn 10 điểm Cộng Hưởng).
            c. \`newClues\`: Một manh mối mới, một cái nhìn sâu sắc về bản chất của Tà Năng hoặc kẻ thù.
    - **Nếu THẤT BẠI:**
        - **BẮT BUỘC:** \`maxPsycheChange\`: -5 hoặc -10 (Lý trí tối đa bị tổn thương vĩnh viễn).
        - \`psycheChange\`: -15 (Sốc tâm lý nặng).
        - **Hình phạt:** Chọn MỘT trong các hình phạt sau:
            a. \`newMutation\`: Một đột biến có hại (ví dụ: "Tiếng Vọng Hoang Tưởng", "Rò Rỉ Năng Lượng").
            b. \`resonanceChange\`: -10 (Giảm vĩnh viễn 10 điểm Cộng Hưởng).
4.  **Lựa chọn (choices):**
    - **Thành công:** Cung cấp lựa chọn: ["Tiếng vọng đã im bặt. Tiếp tục Tinh luyện."]
    - **Thất bại:** Cung cấp lựa chọn: ["Nghi thức đã thất bại. Rời khỏi xưởng."]

Trả về kết quả trong schema JSON được yêu cầu.
`;
};

// --- SERVICE FUNCTIONS ---

export const generateWorkshopOptions = async (puppet: Puppet, shownExplanations: ExplanationId[], inventory: Item[]): Promise<WorkshopData> => {
    const prompt = getWorkshopPrompt(puppet, shownExplanations, inventory);
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

export const triggerAbyssEcho = async (puppet: Puppet, masterBio: string, storyHistory: StorySegment[]): Promise<{ scene: string; choices: string[] }> => {
    const prompt = getAbyssEchoPrompt(puppet, masterBio, storyHistory);
    return await generateContentWithSchema<{ scene: string; choices: string[] }>(prompt, abyssEchoSceneSchema);
};

export const resolveAbyssEcho = async (puppet: Puppet, playerChoice: string, psyche: number): Promise<StorySegment> => {
    const prompt = getAbyssEchoResultPrompt(puppet, playerChoice, psyche);
    return await generateContentWithSchema<StorySegment>(prompt, storySegmentSchema);
};