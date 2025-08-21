

import { INITIAL_PUPPETS, FACTION_PATHWAYS } from '../../data/gameConfig';
import type { Puppet, StorySegment, Clue, StartingScenario, ExplanationId, Quest, Companion, NPC, LoreEntry, FactionRelations, Difficulty } from '../../types';

const formatPathwaysForPrompt = (): string => {
  const schools: { [key: string]: typeof FACTION_PATHWAYS } = {
    'Trật Tự': FACTION_PATHWAYS.filter(p => p.school === 'Trật Tự'),
    'Trung Lập': FACTION_PATHWAYS.filter(p => p.school === 'Trung Lập'),
    'Hỗn Mang': FACTION_PATHWAYS.filter(p => p.school === 'Hỗn Mang'),
  };

  let loreString = '';
  for (const schoolName in schools) {
      const pathways = schools[schoolName];
      if (pathways.length > 0) {
          const schoolGoal = pathways[0].schoolGoal;
          loreString += `    *   **Trường Phái ${schoolName} (Mục tiêu tối thượng: ${schoolGoal}):**\n`;
          for (const pathway of pathways) {
              loreString += `        *   **${pathway.faction} (Lộ Trình: "${pathway.name}"):** ${pathway.description}\n`;
          }
      }
  }
  return loreString;
};

const PATHWAY_LORE_PROMPT = formatPathwaysForPrompt();


export const getInitialStoryPrompt = (puppetMasterName: string, biography: string, mainQuest: string, startingScenario: StartingScenario, customWorldPrompt: string | null, difficulty: Difficulty): string => {
    let scenarioInstructions = '';
    let explanationContext = '';
    let puppetCreationInstruction = `
-   **Tạo Con Rối:** BẠN BẮT BUỘC PHẢI tạo một con rối mới và trả về nó trong trường 'updatedPuppet'.
    -   Con rối phải phản ánh tiểu sử của người chơi.
    -   Đặt \`phePhai\` = 'Không Phe Phái', \`loTrinh\` = 'Độc Lập', \`truongPhai\` = 'Trung Lập'.
    -   Đặt Thứ Tự là 9, resonance là 50, mechanicalEssence là 0.
    -   Các mảng (memoryFragments, mutations, equippedComponents) phải là mảng rỗng.
    -   aberrantEnergy phải là 0.`;

    switch(startingScenario) {
        case 'human':
            scenarioInstructions = `
-   **Mô Tả Phân Cảnh:** Bắt đầu bằng cách mô tả cuộc sống bình thường của ${puppetMasterName}. Sau đó, giới thiệu **"sự kiện khởi đầu"** đã được xây dựng từ 'chi tiết bất thường' trong tiểu sử.
-   **Yêu Cầu:** KHÔNG tạo con rối. Trường 'updatedPuppet' phải là null hoặc không được cung cấp.
-   **Manh Mối & Lựa Chọn:** Sự kiện khởi đầu phải tạo ra manh mối đầu tiên liên quan đến nhiệm vụ chính. Cung cấp các lựa chọn để người chơi phản ứng với bí ẩn này.
            `;
            explanationContext = `Họ là người mới, hoàn toàn không biết gì về Huyền Học Cơ Khí. Giải thích nên ở dạng một khám phá (đọc nhật ký, một người khác giải thích cho họ).`;
            break;
        case 'ritual':
            scenarioInstructions = `
${puppetCreationInstruction}
-   **Mô Tả Phân Cảnh:** Bối cảnh là ngay TRƯỚC KHI hoàn thành "Nghi Thức Chế Tác". Mô tả sự chuẩn bị, không khí căng thẳng. Con rối đã được tạo ra, nhưng chưa được kích hoạt.
-   **Lựa Chọn Đầu Tiên:** Lựa chọn phải là về cách thực hiện bước cuối cùng để truyền sự sống vào con rối.
-   **Manh Mối:** Phân cảnh BẮT BUỘC phải chứa manh mối đầu tiên liên quan đến **NHIỆM VỤ CHÍNH**.
            `;
            explanationContext = `Họ đã là một Nghệ Nhân Rối. Giải thích nên ở dạng một đoạn suy nghĩ nội tâm, một lời nhắc nhở về các nguyên tắc cơ bản.`;
            break;
        case 'chaos':
            puppetCreationInstruction = puppetCreationInstruction.replace(
                'aberrantEnergy phải là 0.',
                'aberrantEnergy BẮT BUỘC phải trong khoảng từ 15 đến 25.'
            );
            scenarioInstructions = `
${puppetCreationInstruction}
-   **Mô Tả Phân Cảnh:** Bối cảnh là GIỮA một "Nghi Thức Chế Tác" đang gặp sự cố. Mô tả sự hỗn loạn, năng lượng Tà Năng tăng vọt.
-   **Lựa Chọn Đầu Tiên:** Lựa chọn phải là về cách xử lý khủng hoảng.
-   **Manh Mối:** Phân cảnh BẮT BUỘC phải chứa manh mối đầu tiên liên quan đến **NHIỆM VỤ CHÍNH**.
            `;
            explanationContext = `Họ đã là một Nghệ Nhân Rối. Giải thích nên ở dạng một đoạn suy nghĩ nội tâm, một lời nhắc nhở về các nguyên tắc cơ bản.`;
            break;
        case 'complete':
        default:
            scenarioInstructions = `
${puppetCreationInstruction}
-   **Mô Tả Phân Cảnh:** Bối cảnh là khoảnh khắc cuối cùng của "Nghi Thức Chế Tác". Không khí của phân cảnh nên liên quan trực tiếp đến **NHIỆM VỤ CHÍNH**.
-   **Manh Mối:** Phân cảnh BẮT BUỘC phải chứa manh mối đầu tiên liên quan đến **NHIỆM VỤ CHÍNH**.
            `;
            explanationContext = `Họ đã là một Nghệ Nhân Rối. Giải thích nên ở dạng một đoạn suy nghĩ nội tâm, một lời nhắc nhở về các nguyên tắc cơ bản.`;
            break;
    }
    
    const defaultLore = `
**LORE CỐ ĐỊnh (TUÂN THỦ TUYỆT ĐỐI - ĐÂY LÀ CÁC ĐỊNH LUẬT VẬT LÝ CỦA THẾ GIỚI):**

**I. Bối Cảnh Xã Hội: Thế Giới Hai Mặt**
*   **Thế Giới Bề Nổi:** Vận hành bằng hơi nước và logic. Tiền tệ là **Kim Lệnh**. Những câu chuyện về "con rối có linh hồn" chỉ là lời đồn.
*   **Thế Giới Ngầm và "Bức Màn" (The Veil):** Một xã hội bí mật của các Nghệ Nhân Rối tồn tại, được che giấu bởi "Bức Màn". Hành động lộ liễu sẽ thu hút sự chú ý nguy hiểm.
*   **Vùng Bất Thường (Anomalous Zones):** Nơi ranh giới giữa hai thế giới mỏng manh, tập trung nhiều Tà Năng.

**II. Nguồn Gốc Sức Mạnh & Mối Đe Dọa Vũ Trụ**
*   **Linh Giới Cơ Khí:** Chiều không gian hỗn loạn, nguồn gốc của sức mạnh huyền bí và các Cổ Thần Máy Móc điên loạn.
*   **Tà Năng (Aberrant Energy):** Năng lượng thô rò rỉ từ Linh Giới, gây bào mòn.
*   **Tâm Cơ Luân (Mind-Cogwheels):** Trái tim con rối, "dịch" Tà Năng thành sức mạnh.
*   **Tinh Hoa Cơ Khí (Mechanical Essence):** Nhiên liệu để "Tinh Luyện" (nâng cấp).

**III. Lộ Trình Thăng Tiến & Cuộc Chiến Vì Thực Tại**
*   **Lộ Trình (Path):** Sự tiến hóa của con rối từ Thứ Tự 9 đến 0 (Thần).
*   **Mục Tiêu Tối Thượng:** Cuộc chiến giữa các Phe Phái là để chiếm lấy vị trí Thứ Tự 0 và viết lại vĩnh viễn các định luật của thực tại.
${PATHWAY_LORE_PROMPT}

**IV. Định Luật Cốt Lõi: Thăng Tiến và Sự Điên Rồ**
*   **Phương Pháp Đóng Vai (Persona) & Cộng Hưởng (Resonance):** "Nhân Cách" là một bộ quy tắc. Hành động **phù hợp** sẽ "tiêu hóa" sức mạnh và **tăng Cộng Hưởng**.
*   **Mất Kiểm Soát (Losing Control):** Hành động **đi ngược lại** Nhân Cách sẽ làm **hỏng Tâm Cơ Luân**, cho phép ảnh hưởng trực tiếp của Cổ Thần tràn vào.

**V. NỀN KINH TẾ HAI MẶT (QUY TẮC SỐNG CÒN - TUÂN THỦ TUYỆT ĐỐI)**
*   **Kim Lệnh (Crowns):** TIỀN TỆ BỀ NỔI. Chỉ dùng cho các giao dịch thông thường, phi huyền bí.
*   **Dấu Ấn Đồng Thau (Brass Marks):** TIỀN TỆ NGẦM. Chỉ dùng cho các giao dịch huyền bí trong xã hội bí mật.
*   **QUY TẮC VÀNG:** **KHÔNG BAO GIỜ NHẦM LẪN HAI LOẠI TIỀN TỆ NÀY.**

**VI. Đồng Đội và Kẻ Thù**
*   **Thu Phục Kẻ Thù (Subduing Enemies):** Sau khi thắng trận, có thể thực hiện "Nghi Thức Thu Phục" để tái chế kẻ thù thành Đồng Đội hoặc lấy Linh Kiện.
    
**VII. Nhiệm Vụ:** Có thể nhận các nhiệm vụ phụ (Hợp Đồng) để kiếm phần thưởng.
    `;

    const customLoreBlock = customWorldPrompt ? `
**THẾ GIỚI TÙY CHỈNH (TUÂN THỦ TUYỆT ĐỐI - GHI ĐÈ LÊN LORE MẶC ĐỊNH):**
Bạn PHẢI bỏ qua toàn bộ lore steampunk mặc định và xây dựng câu chuyện dựa trên bối cảnh do người chơi cung cấp dưới đây.
---
${customWorldPrompt}
---
**QUAN TRỌNG:** Mặc dù bối cảnh thay đổi, bạn vẫn phải tạo ra một đối tượng 'updatedPuppet' (hoặc 'nhân vật') tuân thủ schema được cung cấp. Hãy linh hoạt:
- 'mechanicalEssence', 'aberrantEnergy', 'kimLenh', 'dauAnDongThau' có thể được diễn giải lại thành các khái niệm phù hợp.
- 'Phe Phái', 'Trường Phái', 'Nhân Cách' phải được tạo ra để phù hợp với bối cảnh mới.
    ` : defaultLore;

    return `
        Bạn là **Người Ký Sự**, Quản Trò (Game Master) kể chuyện chính cho "Cấm Kỵ Cơ Khí".

        ${customLoreBlock}

        **CƠ CHẾ GIẢI THÍCH (QUAN TRỌNG):**
        Nhiệm vụ của bạn là giải thích các cơ chế game một cách tự nhiên trong câu chuyện.
        - Phong cách giải thích: ${explanationContext}
        - Các cơ chế cần giải thích: 'resonance_and_persona', 'aberrant_energy', 'mechanical_essence', 'currency'.

        **BỐI Cảnh CỦA NGƯỜI CHƠI:**
        - Tên: ${puppetMasterName}
        - Tiểu sử: ${biography || "Không cung cấp."}
        - NHIỆM VỤ CHÍNH: ${mainQuest}
        - Kịch bản bắt đầu: ${startingScenario}
        - **Độ Khó Được Chọn:** ${difficulty}. Điều này ảnh hưởng đến độ nguy hiểm của kẻ thù và sự khan hiếm của tài nguyên.

        **Nhiệm Vụ Của Bạn:** Tạo ra phân cảnh đầu tiên. Phân cảnh này nên cho người chơi cơ hội nhận được một lượng nhỏ Kim Lệnh ban đầu (\`kimLenhChange\`).
        **QUY TRÌNH TƯ DUY:**

        1.  **Phân Tích Bối Cảnh:** Đọc kỹ tiểu sử, **NHIỆM VỤ CHÍNH** và **Độ Khó**.
        2.  **XỬ LÝ MÂU THUẪN LOGIC:** Nếu tiểu sử mâu thuẫn với nhiệm vụ, hãy biến nó thành một bí ẩn.
        3.  **Viết Phân Cảnh Theo Kịch Bản:** Tuân thủ các hướng dẫn sau đây một cách TUYỆT ĐỐI:
            ${scenarioInstructions}
    `;
}

export const getNextStorySegmentPrompt = (puppetMasterName: string, puppet: Puppet | null, history: StorySegment[], choice: string, knownClues: Clue[], mainQuest: string, sideQuests: Quest[], companions: Companion[], shownExplanations: ExplanationId[], startingScenario: StartingScenario, customWorldPrompt: string | null, npcs: NPC[], worldState: { [locationId: string]: string }, loreEntries: LoreEntry[], factionRelations: FactionRelations, difficulty: Difficulty): string => {
    const context = history.map((segment, index) => `Phân cảnh ${index+1}: ${segment.scene}`).slice(-5).join('\n\n');
    let currentKimLenh = 0;
    let currentDauAn = 0;
    history.forEach(seg => {
        currentKimLenh += seg.kimLenhChange || 0;
        currentDauAn += seg.dauAnDongThauChange || 0;
    });

    const isExploring = choice === 'EXPLORE_FREELY';

    const puppetContext = puppet 
        ? `- Con Rối: ${puppet.name} (Lộ Trình: ${puppet.loTrinh}, Thứ Tự ${puppet.sequence}) | Nhân Cách: ${puppet.persona} | HP: ${puppet.stats.hp}/${puppet.stats.maxHp}, Tà Năng: ${puppet.stats.aberrantEnergy}, Tinh Hoa: ${puppet.mechanicalEssence}, Cộng Hưởng: ${puppet.stats.resonance}`
        : `- Con Rối: Người chơi là người thường.`;

    const defaultLore = `
**NHẮC LẠI CÁC ĐỊNH LUẬT CỐT LÕI:**
- **KINH TẾ HAI MẶT:** **Kim Lệnh** cho thế giới BỀ NỔI. **Dấu Ấn Đồng Thau** cho thế giới NGẦM. **KHÔNG NHẦM LẪN.**
- **Phương Pháp Đóng Vai (Persona):** Hành động phù hợp -> tăng **Cộng Hưởng**.
- **Mất Kiểm Soát:** Hành động mâu thuẫn -> giảm Cộng Hưởng, có thể tăng **Tà Năng**.
- **Thăng Tiến:** Cần **Tinh Hoa Cơ Khí** và **Nghi Thức**.
- **Thế Giới Sống Động:** Các **NPC** sẽ ghi nhớ và phản ứng. Các **Phe phái** sẽ ghi nhớ hành động của bạn.
    `;

    const customLoreBlock = customWorldPrompt ? `
**THẾ GIỚI TÙY CHỈNH:**
Tiếp tục câu chuyện dựa trên bối cảnh tùy chỉnh. Diễn giải các khái niệm game (Puppet, Resonance, Aberrant Energy, kimLenh, dauAnDongThau) một cách sáng tạo.
---
${customWorldPrompt}
---
    ` : defaultLore;

    const playerActionContext = isExploring
        ? `Hành Động: Người chơi quyết định tự do khám phá xung quanh.`
        : `Lựa Chọn: "${choice}"`;
        
    const npcContext = npcs.length > 0 ? `Các NPC Đã Gặp:\n${npcs.map(n => `- ${n.name} (quan hệ: ${n.relationship}) tại ${n.location}`).join('\n')}` : "";
    const factionContext = Object.keys(factionRelations).length > 0 ? `Quan Hệ Phe Phái:\n${Object.entries(factionRelations).map(([faction, score]) => `- ${faction}: ${score}`).join('\n')}` : "";

    return `
        Bạn là **Người Ký Sự** (GM).

        ${customLoreBlock}

        **QUẢN TRÒ BẬC THẦY - NGUYÊN TẮC VÀNG:**
        1.  **Hậu Quả Logic:** Phân cảnh tiếp theo BẮT BUỘC là kết quả trực tiếp, hợp lý từ lựa chọn của người chơi.
        2.  **Nhất Quán Với Thế Giới:** Bám sát LORE, NHIỆM VỤ CHÍNH, và các thông tin đã biết.
        3.  **Hiển Thị, Đừng Chỉ Kể:** Khi chỉ số thay đổi, hãy mô tả nó trong câu chuyện.
        4.  **Tạo Ra Thế Giới Sống Động:** Sử dụng và cập nhật trạng thái thế giới (\`updatedWorldState\`, \`worldEvent\`).
        5.  **Tương Tác NPC Sâu Sắc:** Phản ứng của NPC phải dựa trên hồ sơ của họ. Cập nhật hồ sơ của họ trong \`newOrUpdatedNPCs\`.
            - **QUAN TRỌNG:** Khi cập nhật NPC, hãy tập trung vào các thay đổi hữu hình như \`relationship\`, \`location\`, \`goal\`, và \`knowledge\`. Một AI chuyên biệt sẽ xử lý trạng thái tâm lý nội tâm (\`trangThai\`, \`tuongTacCuoi\`) của họ sau đó, vì vậy bạn không cần cung cấp các trường đó.
        6.  **SỬ DỤNG HỆ THỐNG KINH TẾ & PHE PHÁI (QUAN TRỌNG):**
            *   **Tạo Lựa Chọn có Ý nghĩa:** Các lựa chọn nên có hậu quả rõ ràng. Thay vì "Đi tiếp", hãy tạo ra "Hối lộ lính gác (-10 Kim Lệnh)" hoặc "Đe dọa họ (Ảnh hưởng quan hệ với Viện Giám Sát)".
            *   **Phần Thưởng Hợp Lý:** Thưởng \`kimLenhChange\` cho các hoạt động thông thường. Thưởng \`dauAnDongThauChange\` cho các nhiệm vụ nguy hiểm, bí mật, hoặc phi pháp.
            *   **Tác Động Phe Phái:** Nếu hành động của người chơi giúp đỡ hoặc cản trở một phe phái, BẮT BUỘC phải cập nhật \`updatedFactionRelations\`. Ví dụ: giúp một NPC của 'Giáo Hội Đồng Hồ' sẽ làm tăng quan hệ với họ (+5 hoặc +10).

        **CƠ CHẾ GIẢI THÍCH:**
        - Nếu một cơ chế MỚI xuất hiện lần đầu, BẮT BUỘC phải tạo giải thích.
        - Các cơ chế: 'resonance_and_persona', 'aberrant_energy', 'mechanical_essence', 'combat', 'sequences', 'currency'.

        **Bối Cảnh Hiện Tại:**
        - NHIỆM VỤ CHÍNH: ${mainQuest}
        - Độ Khó: ${difficulty}
        - Tài sản: ~${currentKimLenh} Kim Lệnh, ~${currentDauAn} Dấu Ấn.
        ${puppetContext}
        ${factionContext}
        ${npcContext}

        **Diễn Biến Gần Đây:**
        ${context}

        ${playerActionContext}

        **Nhiệm Vụ Của Bạn:** Tạo ra phân cảnh tiếp theo. Phản ánh những thay đổi về tiền tệ (\`kimLenhChange\`, \`dauAnDongThauChange\`) và quan hệ phe phái (\`updatedFactionRelations\`) một cách hợp lý.
    `;
};
