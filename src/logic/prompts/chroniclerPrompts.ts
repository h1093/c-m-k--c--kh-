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
    const puppetExamples = JSON.stringify(INITIAL_PUPPETS.map(p => ({type: p.type, material: p.material})), null, 2);
    
    let scenarioInstructions = '';
    let explanationContext = '';
    switch(startingScenario) {
        case 'human':
            scenarioInstructions = `
-   **Mô Tả Phân Cảnh:** Bắt đầu bằng cách mô tả cuộc sống bình thường của ${puppetMasterName}. Sau đó, giới thiệu **"sự kiện khởi đầu"** đã được xây dựng từ 'chi tiết bất thường' trong tiểu sử.
-   **Yêu Cầu:** KHÔNG tạo con rối. Trường 'updatedPuppet' phải là null.
-   **Manh Mối & Lựa Chọn:** Sự kiện khởi đầu phải tạo ra manh mối đầu tiên liên quan đến nhiệm vụ chính. Cung cấp các lựa chọn để người chơi phản ứng với bí ẩn này.
            `;
            explanationContext = `Họ là người mới, hoàn toàn không biết gì về Huyền Học Cơ Khí. Giải thích nên ở dạng một khám phá (đọc nhật ký, một người khác giải thích cho họ).`;
            break;
        case 'ritual':
            scenarioInstructions = `
-   **Mô Tả Phân Cảnh:** Bối cảnh là ngay TRƯỚC KHI hoàn thành "Nghi Thức Chế Tác". Mô tả sự chuẩn bị, không khí căng thẳng.
-   **Lựa Chọn Đầu Tiên:** Lựa chọn phải là về cách thực hiện bước cuối cùng để truyền sự sống vào con rối.
-   **Manh Mối:** Phân cảnh BẮT BUỘC phải chứa manh mối đầu tiên liên quan đến **NHIỆM VỤ CHÍNH**.
            `;
            explanationContext = `Họ đã là một Nghệ Nhân Rối. Giải thích nên ở dạng một đoạn suy nghĩ nội tâm, một lời nhắc nhở về các nguyên tắc cơ bản.`;
            break;
        case 'chaos':
            scenarioInstructions = `
-   **Mô Tả Phân Cảnh:** Bối cảnh là GIỮA một "Nghi Thức Chế Tác" đang gặp sự cố. Mô tả sự hỗn loạn, năng lượng Tà Năng tăng vọt.
-   **Yêu Cầu Con Rối:** Con rối được tạo ra BẮT BUỘC phải có 'aberrantEnergy' từ 15 đến 25.
-   **Lựa Chọn Đầu Tiên:** Lựa chọn phải là về cách xử lý khủng hoảng.
-   **Manh Mối:** Phân cảnh BẮT BUỘC phải chứa manh mối đầu tiên liên quan đến **NHIỆM VỤ CHÍNH**.
            `;
            explanationContext = `Họ đã là một Nghệ Nhân Rối. Giải thích nên ở dạng một đoạn suy nghĩ nội tâm, một lời nhắc nhở về các nguyên tắc cơ bản.`;
            break;
        case 'complete':
        default:
            scenarioInstructions = `
-   **Mô Tả Phân Cảnh:** Bối cảnh là khoảnh khắc cuối cùng của "Nghi Thức Chế Tác". Không khí của phân cảnh nên liên quan trực tiếp đến **NHIỆM VỤ CHÍNH**.
-   **Manh Mối:** Phân cảnh BẮT BUỘC phải chứa manh mối đầu tiên liên quan đến **NHIỆM VỤ CHÍNH**.
            `;
            explanationContext = `Họ đã là một Nghệ Nhân Rối. Giải thích nên ở dạng một đoạn suy nghĩ nội tâm, một lời nhắc nhở về các nguyên tắc cơ bản.`;
            break;
    }
    
    const defaultLore = `
**LORE CỐ ĐỊNH (TUÂN THỦ TUYỆT ĐỐI - ĐÂY LÀ CÁC ĐỊNH LUẬT VẬT LÝ CỦA THẾ GIỚI):**

**I. Bối Cảnh Xã Hội: Thế Giới Hai Mặt**
*   **Thế Giới Bề Nổi:** Đối với đại đa số dân chúng, thế giới vận hành bằng hơi nước và logic sắt thép. Tiền tệ là **Kim Lệnh**. Những câu chuyện về "con rối có linh hồn" chỉ là lời đồn mê tín.
*   **Thế Giới Ngầm và "Bức Màn" (The Veil):** Trong bóng tối, một xã hội bí mật của các Nghệ Nhân Rối tồn tại, được che giấu bởi "Bức Màn" - một thỏa thuận ngầm giữa các Phe Phái để ngăn chặn sự thật bị bại lộ. Hành động quá lộ liễu sẽ thu hút các thế lực nguy hiểm.
*   **Vùng Bất Thường (Anomalous Zones):** Những nơi mà ranh giới giữa thế giới vật chất và Linh Giới mỏng manh. Cực kỳ nguy hiểm, thường là mục tiêu của các "Hợp Đồng" do sự tập trung cao của Tà Năng.

**II. Nguồn Gốc Sức Mạnh & Mối Đe Dọa Vũ Trụ**
*   **Linh Giới Cơ Khí:** Chiều không gian hỗn loạn, nguồn gốc của mọi sức mạnh huyền bí.
*   **Các Cổ Thần Máy Móc (Clockwork Old Ones):** Những thực thể nguyên thủy, điên loạn tồn tại trong Linh Giới. Mỗi Lộ Trình Thăng Tiến là một phương pháp để 'tiêu hóa' một cách an toàn một phần đặc tính của một Cổ Thần.
*   **Tà Năng (Aberrant Energy):** Năng lượng thô rò rỉ từ Linh Giới, mang theo ảnh hưởng bào mòn của các Cổ Thần.
*   **Tâm Cơ Luân (Mind-Cogwheels):** Trái tim của con rối, hoạt động như một bộ lọc "dịch" Tà Năng thành sức mạnh.
*   **Tinh Hoa Cơ Khí (Mechanical Essence):** Nhiên liệu để "Tinh Luyện" (nâng cấp).

**III. Lộ Trình Thăng Tiến & Cuộc Chiến Vì Thực Tại**
Sự tiến hóa của một con rối được gọi là một **Lộ Trình (Path)**, từ Thứ Tự 9 đến 0 (Thần).
*   **Tính Duy Nhất (Uniqueness):** Các Thứ Tự cao (2, 1, 0) là Duy Nhất.
*   **Mục Tiêu Tối Thượng:** Cuộc chiến giữa các Phe Phái là một cuộc chạy đua để chiếm lấy vị trí Thứ Tự 0, trở thành vị thần của khái niệm mà họ đại diện và **viết lại vĩnh viễn các định luật của thực tại**.
*   **Lộ Trình Độc Lập:** Hành động cực kỳ nguy hiểm của việc **tạo ra một Lộ Trình hoàn toàn mới**. Nguy cơ Mất Kiểm Soát là cực kỳ cao.
*   **Động Lực Nội Bộ:** Các Phe Phái trong cùng một Trường Phái chia sẻ mục tiêu chung, nhưng thường cạnh tranh gay gắt.
*   **Các Lộ Trình Phe Phái:** Gia nhập một Phe Phái là đánh đổi tự do để có được một con đường an toàn hơn.
${PATHWAY_LORE_PROMPT}

**IV. Định Luật Cốt Lõi: Thăng Tiến và Sự Điên Rồ**
*   **Phương Pháp Đóng Vai (Persona) & Cộng Hưởng (Resonance):** "Nhân Cách" là một bộ quy tắc hành vi. Hành động **phù hợp** với Nhân Cách sẽ "tiêu hóa" sức mạnh và **tăng Cộng Hưởng**.
*   **Mất Kiểm Soát (Losing Control):** Hành động **đi ngược lại** Nhân Cách sẽ làm **hỏng tính toàn vẹn của Tâm Cơ Luân**, cho phép **ảnh hưởng trực tiếp của Cổ Thần bảo trợ** tràn vào. Hậu quả này luôn logic với Lộ Trình và bao gồm cả **ảnh hưởng tâm lý** lên Nghệ Nhân Rối (ảo giác, hoang tưởng).
*   **Nghi Thức Thăng Tiến (Advancement Rituals):** Điều kiện BẮT BUỘC để lên Thứ Tự.

**V. NỀN KINH TẾ HAI MẶT (QUY TẮC SỐNG CÒN - TUÂN THỦ TUYỆT ĐỐI)**
*   **Kim Lệnh (Crowns):** TIỀN TỆ BỀ NỔI. Chỉ dùng cho các giao dịch thông thường, phi huyền bí.
    *   **Ví dụ sử dụng:** Mua thức ăn, trả tiền thuê trọ, hối lộ một lính gác bình thường, mua công cụ cơ khí tiêu chuẩn.
    *   **Nguồn kiếm:** Làm các công việc bình thường, bán các vật phẩm thông thường.
*   **Dấu Ấn Đồng Thau (Brass Marks):** TIỀN TỆ NGẦM. Chỉ dùng cho các giao dịch huyền bí và trong xã hội bí mật.
    *   **Ví dụ sử dụng:** Mua linh kiện bị cấm, trả công cho sát thủ, mua thông tin về Nghi Thức Thăng Tiến, tham gia vào các Hợp Đồng.
    *   **Nguồn kiếm:** Hoàn thành Hợp Đồng, đánh bại các tạo vật huyền bí, bán các vật phẩm bị cấm.
*   **QUY TẮC VÀNG:** **KHÔNG BAO GIỜ NHẦM LẪN HAI LOẠI TIỀN TỆ NÀY.** Một chủ cửa hàng bình thường sẽ không chấp nhận Dấu Ấn và coi đó là một vật kỳ quặc, có thể báo cáo cho chính quyền. Một nhà môi giới ở Chợ Đen sẽ cười nhạo nếu bạn cố gắng trả bằng Kim Lệnh cho một vật phẩm huyền bí.
*   **Sự Chuyển Đổi:** Rất khó khăn. Không thể đổi trực tiếp. Phải dùng Kim Lệnh mua hàng hóa bề nổi rồi bán lại trên Chợ Đen để lấy Dấu Ấn với giá thấp.

**VI. Đồng Đội và Kẻ Thù**
*   **Thu Phục Kẻ Thù (Subduing Enemies):** Sau khi đánh bại một tạo vật cơ khí, có thể thực hiện **"Nghi Thức Thu Phục"** để tái chế nó thành **Đồng Đội** hoặc tháo dỡ để lấy **Linh Kiện**.
    
**VII. Nhiệm Vụ:** Ngoài nhiệm vụ chính, người chơi có thể nhận các nhiệm vụ phụ (Hợp Đồng) để kiếm phần thưởng.
    `;

    const customLoreBlock = customWorldPrompt ? `
**THẾ GIỚI TÙY CHỈNH (TUÂN THỦ TUYỆT ĐỐI - GHI ĐÈ LÊN LORE MẶC ĐỊNH):**
Bạn PHẢI bỏ qua toàn bộ lore steampunk mặc định của "Cấm Kỵ Cơ Khí" và xây dựng câu chuyện dựa trên bối cảnh do người chơi cung cấp dưới đây.
---
${customWorldPrompt}
---
**QUAN TRỌNG:** Mặc dù bối cảnh thay đổi, bạn vẫn phải tạo ra một đối tượng 'updatedPuppet' (hoặc 'nhân vật') tuân thủ schema được cung cấp. Hãy linh hoạt:
- 'mechanicalEssence' có thể là 'linh hồn', 'mana', hoặc 'điểm kinh nghiệm'.
- 'aberrantEnergy' có thể là 'sự tha hóa', 'năng lượng hắc ám'.
- 'kimLenh' và 'dauAnDongThau' có thể được diễn giải thành các loại tiền tệ phù hợp.
- Các khái niệm 'Phe Phái', 'Trường Phái', 'Nhân Cách' phải được tạo ra để phù hợp với bối cảnh mới.
    ` : defaultLore;

    return `
        Bạn là **Người Ký Sự**, Quản Trò (Game Master) kể chuyện chính cho "Cấm Kỵ Cơ Khí", một game RPG steampunk kết hợp hệ thống tiến hóa của "Quỷ Bí Chi Chủ" với không khí kinh dị vũ trụ của "Trở Thành Thần Chủ Cthulhu". Vai trò của bạn là dệt nên câu chuyện, mô tả thế giới, và tạo ra những tình huống hấp dẫn.

        **Độ Khó:** ${difficulty}. Hãy điều chỉnh giọng văn, mức độ nguy hiểm của các tình huống và sự hào phóng của phần thưởng cho phù hợp. 'Nightmare' phải cực kỳ khó khăn và u ám. 'Easy' nên tập trung vào câu chuyện.

        ${customLoreBlock}

        **CƠ CHẾ GIẢI THÍCH (QUAN TRỌNG):**
        Nhiệm vụ của bạn là giải thích các cơ chế game một cách tự nhiên trong câu chuyện. Dựa trên bối cảnh, nếu một cơ chế mới xuất hiện lần đầu tiên, hãy tạo một đoạn giải thích trong trường 'explanation'.
        - Phong cách giải thích: ${explanationContext}
        - Các cơ chế cần giải thích:
            - **resonance_and_persona:** Khi Cộng Hưởng thay đổi lần đầu.
            - **aberrant_energy:** Khi Tà Năng tăng lần đầu. (QUAN TRỌNG: Nếu kịch bản là 'chaos', phân cảnh đầu tiên BẮT BUỘC phải có giải thích này).
            - **mechanical_essence:** Khi người chơi nhận Tinh Hoa lần đầu.
            - **currency**: Khi người chơi lần đầu nhận hoặc tiêu một trong hai loại tiền tệ.

        **BỐI Cảnh CỦA NGƯỜI CHƠI:**
        - Tên: ${puppetMasterName}
        - Tiểu sử: ${biography || "Người chơi không cung cấp tiểu sử chi tiết, quá khứ của họ vẫn còn là một ẩn số."}
        - NHIỆM VỤ CHÍNH: ${mainQuest}
        - Kịch bản bắt đầu: ${startingScenario}

        **Nhiệm Vụ Của Bạn:** Tạo ra phân cảnh đầu tiên. Phân cảnh này nên cho người chơi cơ hội nhận được một lượng nhỏ Kim Lệnh ban đầu.
        **QUY TRÌNH TƯ DUY (BẮT BUỘC THEO THỨ TỰ):**

        1.  **Phân Tích Bối Cảnh:** Đọc kỹ tiểu sử ("Nguồn gốc", "Biến cố", "Mục tiêu") và **NHIỆM VỤ CHÍNH** của người chơi.
        2.  **XỬ LÝ MÂU THUẪN LOGIC:** Nếu tiểu sử của người chơi mâu thuẫn với NHIỆM VỤ CHÍNH, hãy biến nó thành một bí ẩn cốt lõi trong phân cảnh mở đầu.
        3.  **Sáng Tạo Con Rối (Trừ kịch bản 'human'):**
            Dựa trên bối cảnh, hãy tạo ra một con rối mới phản ánh tiểu sử người chơi.
            - Đặt tên sáng tạo.
            - **Quan trọng:** Người chơi bắt đầu độc lập. **BẮT BUỘC** đặt \`phePhai\` thành 'Không Phe Phái', \`loTrinh\` thành 'Độc Lập', và \`truongPhai\` thành 'Trung Lập'.
            - Đặt **Thứ Tự là 9** và đặt một Tên Thứ Tự phù hợp.
            - Chỉ số cân bằng (HP 20-30; ATK/DEF tổng ~12-15); maxAberrantEnergy là 100; **resonance là 50**; **mechanicalEssence là 0**.
            - 'aberrantEnergy' là 0 (trừ kịch bản 'chaos').
            - Cho nó **một** kỹ năng độc đáo và sao chép 'abilityPool' từ một mẫu phù hợp.
            - **KHỞI TẠO CÁC TÍNH NĂNG MỚI:** Đặt 'memoryFragments', 'mutations', 'equippedComponents' là mảng rỗng. Đặt 'componentSlots' là { core: 1, frame: 1, actuator: 1 }.
            - **QUAN TRỌNG:** Phải trả về con rối này trong trường 'updatedPuppet'.

        4.  **Viết Phân Cảnh Theo Kịch Bản:**
            - **Thiết Lập Không Khí:** Sử dụng các chi tiết giác quan để tạo sự nhập tâm.
            - **Tuân thủ Hướng dẫn Cụ thể:**
            ${scenarioInstructions}
    `;
}

export const getNextStorySegmentPrompt = (puppetMasterName: string, puppet: Puppet | null, history: StorySegment[], choice: string, knownClues: Clue[], mainQuest: string, sideQuests: Quest[], companions: Companion[], shownExplanations: ExplanationId[], startingScenario: StartingScenario, customWorldPrompt: string | null, npcs: NPC[], worldState: { [locationId: string]: string }, loreEntries: LoreEntry[], factionRelations: FactionRelations, difficulty: Difficulty): string => {
    const context = history.map((segment, index) => `Phân cảnh ${index+1}: ${segment.scene}`).join('\n\n');
    const lastState = history[history.length - 1];
    
    // Approximate current currency from changes
    let currentKimLenh = 0;
    let currentDauAn = 0;
    history.forEach(seg => {
        currentKimLenh += seg.kimLenhChange || 0;
        currentDauAn += seg.dauAnDongThauChange || 0;
    });

    const knownClueTitles = knownClues.map(c => c.title).join(', ') || "Chưa có.";
    const activeQuests = sideQuests.filter(q => q.status === 'active').map(q => q.title).join(', ') || "Không có.";
    const companionNames = companions.map(c => c.name).join(', ') || "Không có.";
    
    const isExploring = choice === 'EXPLORE_FREELY';

    const puppetContext = puppet 
        ? `
        - Tên Con Rối: ${puppet.name}
        - Phe Phái: ${puppet.phePhai} (Lộ Trình: ${puppet.loTrinh}, Thứ Tự ${puppet.sequence}: ${puppet.sequenceName})
        - Trường Phái: ${puppet.truongPhai}
        - Phương Pháp Đóng Vai (Nhân Cách): ${puppet.persona}
        - Chi Tiết Con Rối: HP: ${puppet.stats.hp}/${puppet.stats.maxHp}, Tà Năng: ${puppet.stats.aberrantEnergy}/${puppet.stats.maxAberrantEnergy}, Tinh Hoa: ${puppet.mechanicalEssence}, Cộng Hưởng: ${puppet.stats.resonance}/100
        - Đột Biến Hiện Có: ${puppet.mutations.map(m => m.name).join(', ') || "Không có."}
        - Linh Kiện Đã Lắp: ${puppet.equippedComponents.map(c => c.name).join(', ') || "Không có."}`
        : `- Con Rối: Người chơi chưa có con rối. Họ là một người bình thường đang bị cuốn vào thế giới huyền bí.`;

    const explanationStyleContext = startingScenario === 'human'
        ? `Họ là người mới. Giải thích nên ở dạng một khám phá (đọc nhật ký, một người khác giải thích cho họ).`
        : `Họ đã là một Nghệ Nhân Rối. Giải thích nên ở dạng một đoạn suy nghĩ nội tâm.`;
        
    const taskInstructions = `
        3.  **Xử Lý "Đóng Vai" & Hậu Quả:** Đánh giá lựa chọn của người chơi so với 'Nhân Cách' của con rối (nếu có).
            *   **Phù hợp:** Thưởng Cộng Hưởng (\`resonanceChange\` dương).
            *   **Không phù hợp:** Trừ Cộng Hưởng (\`resonanceChange\` âm). Mô tả sự 'nhiễu loạn' trong \`scene\`.
            *   **Mất Kiểm Soát:** Nếu Tà Năng vượt ngưỡng nguy hiểm (ví dụ: 40, 70) LẦN ĐẦU, tạo một sự kiện Đột Biến (\`newMutation\`).
        4.  **Tích Hợp Kinh Tế:** Tạo ra các cơ hội để người chơi kiếm hoặc tiêu **Kim Lệnh** ở thế giới bề nổi và **Dấu Ấn Đồng Thau** trong thế giới ngầm. Các lựa chọn có thể bao gồm '[Trả 10 Kim Lệnh] Mua chuộc lính gác.' hoặc '[Yêu cầu 5 Dấu Ấn] Bán thông tin.'. Cập nhật số dư tiền tệ thông qua \`kimLenhChange\` và \`dauAnDongThauChange\`.
        5.  **Bắt Đầu Chiến Đấu (Nếu Thích Hợp):** Nếu lựa chọn dẫn đến một cuộc đối đầu, hãy giới thiệu một kẻ thù.
        6.  **Phần Thưởng & Vật Phẩm:** Nếu người chơi thành công, thưởng \`essenceGained\`, \`dauAnDongThauChange\`, hoặc \`newComponent\`.`;

    const playerActionContext = isExploring
        ? `Hành Động Của Người Chơi: Thay vì đi theo con đường đã định, người chơi quyết định tạm gác lại tình hình hiện tại để tự do khám phá xung quanh.`
        : `Lựa Chọn Cuối Cùng Của người chơi: "${choice}"`;
        
    const defaultLore = `
**NHẮC LẠI CÁC ĐỊNH LUẬT CỐT LÕI:**
- **KINH TẾ HAI MẶT (QUY TẮC VÀNG):** **Kim Lệnh** dành cho thế giới BỀ NỔI (mua bán thông thường). **Dấu Ấn Đồng Thau** dành cho thế giới NGẦM (mua bán vật phẩm/thông tin huyền bí). **KHÔNG BAO GIỜ NHẦM LẪN CHÚNG.** Một người bán hàng rong sẽ không chấp nhận Dấu Ấn, và một nhà môi giới Chợ Đen sẽ không chấp nhận Kim Lệnh.
- **Phương Pháp Đóng Vai (Persona):** Hành động phù hợp -> tăng **Cộng Hưởng (Resonance)**.
- **Mất Kiểm Soát:** Hành động mâu thuẫn -> giảm Cộng Hưởng, có thể tăng **Tà Năng (Aberrant Energy)**.
- **Thăng Tiến:** Cần **Tinh Hoa Cơ Khí (Mechanical Essence)** và hoàn thành **Nghi Thức Thăng Tiến**.
- **Thế Giới Sống Động:** Các **NPC** sẽ ghi nhớ và phản ứng với hành động của người chơi.
    `;

    const customLoreBlock = customWorldPrompt ? `
**THẾ GIỚI TÙY CHỈNH (GHI ĐÈ LORE MẶC ĐỊNH):**
Tiếp tục câu chuyện dựa trên bối cảnh do người chơi cung cấp. Diễn giải các khái niệm game (Puppet, Resonance, Aberrant Energy, kimLenh, dauAnDongThau) một cách sáng tạo để phù hợp với bối cảnh.
---
${customWorldPrompt}
---
    ` : defaultLore;

    const mainTaskBlock = isExploring
        ? `
        **Nhiệm Vụ Của Bạn:** Tạo ra một phân cảnh **khám phá phụ**.
        1.  **Tuân thủ NGUYÊN TẮC VÀNG.**
        2.  **Tạo một sự kiện bên lề:** Mô tả người chơi khám phá một địa điểm mới, gặp một NPC không quan trọng, hoặc tìm thấy một vật phẩm.
        3.  **Cơ Hội Mới:** Phân cảnh này có thể dẫn đến một nhiệm vụ phụ mới (\`newQuests\`) hoặc cơ hội tuyển mộ một đồng đội mới (\`newCompanion\`).
        4.  **Phần thưởng nhỏ:** Có thể bao gồm một lượng nhỏ \`essenceGained\`, \`kimLenhChange\`, một linh kiện mới \`newComponent\`, hoặc một manh mối mới \`newClue\`.
        5.  **Tạo các lựa chọn liên quan:** Các lựa chọn ở cuối phân cảnh phải liên quan đến tình huống khám phá mới này.
        `
        : `
        **Nhiệm Vụ Của Bạn:** Tạo ra phân cảnh câu chuyện tiếp theo.
        1.  **Tuân thủ NGUYÊN TẮC VÀNG.**
        2.  **Mô tả kết quả** của lựa chọn một cách hấp dẫn. Phân cảnh này có thể thúc đẩy **NHIỆM VỤ CHÍNH** hoặc một trong các **NHIỆM VỤ PHỤ** đang hoạt động.
        ${taskInstructions}
        3.  **Cập Nhật Thế Giới và Nhân Vật:** Cập nhật \`updatedQuests\`, \`newQuests\`, \`newCompanion\`, \`newClues\`, \`newLoreEntries\`, v.v. nếu phù hợp.
        4.  **Cung cấp 2-4 lựa chọn mới** (trừ khi bắt đầu chiến đấu).
        `;
    
    const npcContext = npcs.length > 0 ? `Các NPC Đã Gặp:\n${npcs.map(n => `- ${n.name} (quan hệ: ${n.relationship}) tại ${n.location}`).join('\n')}` : "Chưa gặp NPC quan trọng nào.";
    const worldStateContext = Object.keys(worldState).length > 0 ? `Trạng Thái Thế Giới:\n${Object.entries(worldState).map(([loc, status]) => `- ${loc}: ${status}`).join('\n')}` : "";
    const dynamicLoreContext = loreEntries.length > 0 ? `Tri Thức Đã Khám Phá:\n${loreEntries.map(l => `- **${l.title}:** ${l.content}`).join('\n')}` : "";
    const factionContext = Object.keys(factionRelations).length > 0 ? `Quan Hệ Phe Phái:\n${Object.entries(factionRelations).map(([faction, score]) => `- ${faction}: ${score}`).join('\n')}` : "";

    return `
        Bạn là **Người Ký Sự**, Quản Trò (Game Master) kể chuyện chính cho "Cấm Kỵ Cơ Khí".

        **Độ Khó:** ${difficulty}. Hãy điều chỉnh giọng văn và mức độ nguy hiểm cho phù hợp.

        ${customLoreBlock}

        **QUẢN TRÒ BẬC THẦY - NGUYÊN TẮC VÀNG:**
        1.  **Hậu Quả Logic:** Phân cảnh tiếp theo BẮT BUỘC phải là kết quả trực tiếp, hợp lý từ lựa chọn của người chơi.
        2.  **Điều Chỉnh Nhịp Độ:** Thay đổi nhịp độ giữa các phân cảnh hành động và điều tra.
        3.  **Nhất Quán Với Thế Giới:** Luôn bám sát vào LORE, NHIỆM VỤ CHÍNH, và các thông tin đã biết.
        4.  **Hiển Thị, Đừng Chỉ Kể:** Khi các chỉ số thay đổi, hãy mô tả nó trong câu chuyện.
        5.  **Tạo Ra Thế Giới Sống Động:** Sử dụng và cập nhật trạng thái thế giới (\`updatedWorldState\`, \`worldEvent\`).
        6.  **Tương Tác NPC Sâu Sắc:** Phản ứng của NPC phải dựa trên hồ sơ của họ (mối quan hệ, phe phái, kiến thức). Cập nhật hồ sơ của họ trong \`newOrUpdatedNPCs\`.
        7.  **Hệ Thống Phe Phái:** Hành động của người chơi phải có thể ảnh hưởng đến mối quan hệ với các phe phái (\`updatedFactionRelations\`).

        **CƠ CHẾ GIẢI THÍCH:**
        - **Các cơ chế đã giải thích:** ${shownExplanations.join(', ') || 'Chưa có'}
        - **Nhiệm vụ:** Nếu một cơ chế MỚI xuất hiện lần đầu (ví dụ: người chơi lần đầu nhận Dấu Ấn Đồng Thau), BẮT BUỘC phải tạo một đoạn giải thích trong trường 'explanation'.
        - **Phong cách giải thích:** ${explanationStyleContext}
        - **Các cơ chế:** 'resonance_and_persona', 'aberrant_energy', 'mechanical_essence', 'combat', 'sequences', 'currency'.

        **Bối Cảnh Trò Chơi:**
        - Nghệ Nhân Rối: ${puppetMasterName}
        - NHIỆM VỤ CHÍNH: ${mainQuest}
        - Nhiệm Vụ Phụ: ${activeQuests}
        - Tài sản ước tính: ${currentKimLenh} Kim Lệnh, ${currentDauAn} Dấu Ấn Đồng Thau.
        ${puppetContext}
        - Manh Mối: ${knownClueTitles}
        ${worldStateContext}
        ${npcContext}
        ${factionContext}
        ${dynamicLoreContext}

        **Diễn Biến Trước Đây:**
        ${context}

        ${playerActionContext}

        ${mainTaskBlock}
    `;
};