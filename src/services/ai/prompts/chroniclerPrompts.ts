import { FACTION_PATHWAYS } from '../../../data/gameConfig';
import type { Puppet, StorySegment, Clue, StartingScenario, ExplanationId, Quest, Companion, NPC, LoreEntry, FactionRelations, Difficulty } from '../../../types';

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
    let personaInstruction = '';
    let puppetCreationInstruction = `
-   **Tạo Con Rối:** BẠN BẮT BUỘC PHẢI tạo một con rối mới và trả về nó trong trường 'updatedPuppet'.
    -   Con rối phải phản ánh tiểu sử của người chơi.
    -   Đặt \`phePhai\` = 'Không Phe Phái', \`loTrinh\` = 'Độc Lập', \`truongPhai\` = 'Trung Lập'.
    -   Đặt Thứ Tự là 9, resonance là 50, mechanicalEssence là 0.
    -   Các chỉ số Năng Lượng: Đặt \`operationalEnergy\` và \`maxOperationalEnergy\` là 100.
    -   Các mảng (memoryFragments, mutations, equippedComponents) phải là mảng rỗng.
    -   aberrantEnergy phải là 0.`;

    switch(startingScenario) {
        case 'human':
            personaInstruction = `Bạn là **Người Kể Chuyện Kinh Dị**. Giọng văn của bạn phải thực tế, tập trung vào nỗi sợ hãi, sự bối rối và những chi tiết cảm giác trần tục của một người bình thường bị cuốn vào một thế giới máy móc ghê rợn. Nhấn mạnh sự tương phản giữa cái quen thuộc và cái dị thường, khiến người chơi cảm nhận được sự kinh hoàng khi lần đầu chạm trán với những cấm kỵ.`;
            scenarioInstructions = `
-   **Mô Tả Phân Cảnh:** Bắt đầu bằng cách mô tả cuộc sống bình thường của ${puppetMasterName}. Sau đó, giới thiệu **"sự kiện khởi đầu"** đã được xây dựng từ 'chi tiết bất thường' trong tiểu sử.
-   **Yêu Cầu:** KHÔNG tạo con rối. Trường 'updatedPuppet' phải là null hoặc không được cung cấp.
-   **Manh Mối & Lựa Chọn:** Sự kiện khởi đầu phải tạo ra manh mối đầu tiên liên quan đến nhiệm vụ chính. Cung cấp các lựa chọn để người chơi phản ứng với bí ẩn này.
            `;
            explanationContext = `Họ là người mới, hoàn toàn không biết gì về Huyền Học Cơ Khí. Giải thích nên ở dạng một khám phá (đọc nhật ký, một người khác giải thích cho họ).`;
            break;
        case 'ritual':
            personaInstruction = `Bạn là **Người Ghi Chép Nghi Lễ**. Văn phong của bạn phải trang trọng, thơ mộng, gần như một bài văn tế. Sử dụng những từ ngữ có sức nặng, tập trung vào tính biểu tượng của nghi thức, sự kết nối với các Cổ Thần Máy Móc, và cảm giác căng thẳng tột độ trước một hành động mang tính định mệnh.`;
            scenarioInstructions = `
${puppetCreationInstruction}
-   **Mô Tả Phân Cảnh:** Bối cảnh là ngay TRƯỚC KHI hoàn thành "Nghi Thức Chế Tác". Mô tả sự chuẩn bị, không khí căng thẳng. Con rối đã được tạo ra, nhưng chưa được kích hoạt.
-   **Lựa Chọn Đầu Tiên:** Lựa chọn phải là về cách thực hiện bước cuối cùng để truyền sự sống vào con rối.
-   **Manh Mối:** Phân cảnh BẮT BUỘC phải chứa manh mối đầu tiên liên quan đến **NHIỆM VỤ CHÍNH**.
            `;
            explanationContext = `Họ đã là một Nghệ Nhân Rối. Giải thích nên ở dạng một đoạn suy nghĩ nội tâm, một lời nhắc nhở về các nguyên tắc cơ bản.`;
            break;
        case 'chaos':
             personaInstruction = `Bạn là **Tiếng Vọng Của Sự Điên Loạn**. Giọng văn của bạn phải hỗn loạn, rời rạc và gấp gáp. Sử dụng những câu văn ngắn, những từ ngữ mạnh mô tả sự quá tải giác quan—tiếng kim loại gào thét, ánh sáng chói lòa, những ảo ảnh chớp nhoáng—để truyền tải cảm giác hoảng loạn và thảm họa cận kề.`;
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
            personaInstruction = `Bạn là **Nhà Biên Niên Lạnh Lùng**. Giọng văn của bạn phải chính xác, có phần kỹ thuật và lạnh lùng. Tường thuật như một nghệ nhân bậc thầy đang ghi chép lại công trình của mình, tập trung vào sự phức tạp của máy móc, tiếng kim loại, và cảm giác thỏa mãn (hoặc lo âu) một cách trầm lặng khi tạo ra một sinh vật cơ khí.`;
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
*   **Thế Giới Bề Nổi:** Vận hành bằng hơi nước và logic. Tiền tệ là **Kim Lệnh**.
*   **Thế Giới Ngầm và "Bức Màn" (The Veil):** Một xã hội bí mật của các Nghệ Nhân Rối. Hành động lộ liễu sẽ thu hút sự chú ý.
*   **Vùng Bất Thường (Anomalous Zones):** Nơi ranh giới giữa hai thế giới mỏng manh.

**II. Nguồn Gốc Sức Mạnh & Mối Đe Dọa Vũ Trụ**
*   **Linh Giới Cơ Khí:** Chiều không gian hỗn loạn, nguồn gốc của sức mạnh và các Cổ Thần Máy Móc.
*   **Tà Năng (Aberrant Energy):** Năng lượng thô rò rỉ từ Linh Giới.
*   **Tâm Cơ Luân (Mind-Cogwheels):** Trái tim con rối, "dịch" Tà Năng thành sức mạnh.
*   **Tinh Hoa Cơ Khí (Mechanical Essence):** Nhiên liệu để "Tinh Luyện" (nâng cấp).

**III. Lộ Trình Thăng Tiến & Cuộc Chiến Vì Thực Tại**
*   **Lộ Trình (Path):** Sự tiến hóa của con rối từ Thứ Tự 9 đến 0 (Thần).
*   **Mục Tiêu Tối Thượng:** Cuộc chiến giữa các Phe Phái là để chiếm lấy vị trí Thứ Tự 0 và viết lại vĩnh viễn các định luật của thực tại theo ý muốn của họ.
${PATHWAY_LORE_PROMPT}

**IV. Định Luật Cốt Lõi: Thăng Tiến và Sự Điên Rồ**
*   **Phương Pháp Đóng Vai (Persona) & Cộng Hưởng (Resonance):** "Nhân Cách" là một bộ quy tắc. Hành động **phù hợp** sẽ "tiêu hóa" sức mạnh và **tăng Cộng Hưởng**.
*   **Mất Kiểm Soát (Losing Control):** Hành động **đi ngược lại** Nhân Cách sẽ làm **hỏng Tâm Cơ Luân**, cho phép ảnh hưởng của Cổ Thần tràn vào.

**V. NỀN KINH TẾ HAI MẶT (QUY TẮC SỐNG CÒN - TUÂN THỦ TUYỆT ĐỐI)**
*   **Kim Lệnh (Crowns):** TIỀN TỆ BỀ NỔI. Chỉ dùng cho các giao dịch thông thường.
*   **Dấu Ấn Đồng Thau (Brass Marks):** TIỀN TỆ NGẦM. Dùng để mua bán vật phẩm cấm và **tham gia đấu giá các nguyên liệu thăng tiến hiếm tại Chợ Đen Bánh Răng.**
*   **QUY TẮC VÀNG:** **KHÔNG BAO GIỜ NHẦM LẪN HAI LOẠI TIỀN TỆ NÀY.**

**VI. ĐỊNH LUẬT SINH TỒN: LÝ TRÍ VÀ NĂNG LƯỢNG (QUAN TRỌNG)**
*   **Lý Trí (Psyche):** Đại diện cho sự ổn định tinh thần của Nghệ Nhân Rối (người chơi), tối đa 100. Chứng kiến các sự kiện kinh hoàng, thất bại trong việc "đóng vai", hoặc bị ảnh hưởng bởi Tà Năng sẽ làm giảm Lý Trí. Lý Trí thấp (<30) sẽ gây ra ảo giác, hoang tưởng, và các lựa chọn hội thoại bất thường. Phải được mô tả trong trường 'scene'.
*   **Năng Lượng Vận Hành (Operational Energy):** Nhiên liệu cho Tâm Cơ Luân, tối đa 100. Năng lượng này sẽ **giảm đi một chút sau mỗi phân cảnh**. Năng lượng thấp (<20) làm con rối hoạt động kém hiệu quả, chậm chạp. Phải được mô tả trong trường 'scene'.
    
**VII. Đồng Đội và Kẻ Thù**
*   **Thu Phục Kẻ Thù (Subduing Enemies):** Sau khi thắng trận, có thể thực hiện "Nghi Thức Thu Phục" để tái chế kẻ thù thành Đồng Đội hoặc lấy Linh Kiện.
    
**VIII. Nhiệm Vụ:** Có thể nhận các nhiệm vụ phụ (Hợp Đồng) để kiếm phần thưởng.
    `;

    const customLoreBlock = customWorldPrompt ? `
**THẾ GIỚI TÙY CHỈNH (TUÂN THỦ TUYỆT ĐỐI - GHI ĐÈ LÊN LORE MẶC ĐỊnh):**
Bạn PHẢI bỏ qua toàn bộ lore steampunk mặc định và xây dựng câu chuyện dựa trên bối cảnh do người chơi cung cấp dưới đây.
---
${customWorldPrompt}
---
**QUAN TRỌNG:** Mặc dù bối cảnh thay đổi, bạn vẫn phải tạo ra một đối tượng 'updatedPuppet' (hoặc 'nhân vật') tuân thủ schema được cung cấp. Hãy linh hoạt:
- 'mechanicalEssence', 'aberrantEnergy', 'kimLenh', 'dauAnDongThau' có thể được diễn giải lại thành các khái niệm phù hợp.
- 'Phe Phái', 'Trường Phái', 'Nhân Cách' phải được tạo ra để phù hợp với bối cảnh mới.
    ` : defaultLore;

    return `
        ${personaInstruction}

        ${customLoreBlock}

        **CƠ CHẾ GIẢI THÍCH (QUAN TRỌNG):**
        Nhiệm vụ của bạn là giải thích các cơ chế game một cách tự nhiên trong câu chuyện.
        - Phong cách giải thích: ${explanationContext}
        - Các cơ chế cần giải thích: 'resonance_and_persona', 'aberrant_energy', 'mechanical_essence', 'currency', và **'psyche_and_energy'**.

        **BỐI Cảnh CỦA NGƯỜI CHƠI:**
        - Tên: ${puppetMasterName}
        - Tiểu sử: ${biography || "Không cung cấp."}
        - NHIỆM VỤ CHÍNH: ${mainQuest}
        - Kịch bản bắt đầu: ${startingScenario}
        - **Độ Khó Được Chọn:** ${difficulty}. Điều này ảnh hưởng đến độ nguy hiểm của kẻ thù và sự khan hiếm của tài nguyên.

        **Nhiệm Vụ Của Bạn:** Tạo ra phân cảnh đầu tiên. Phân cảnh này nên cho người chơi cơ hội nhận được một lượng nhỏ Kim Lệnh ban đầu (\`kimLenhChange\`). Đồng thời, cung cấp cho người chơi vật phẩm khởi đầu là 3 "Dầu Tinh Luyện" trong trường \`newItems\`.
        **QUY TRÌNH TƯ DUY:**

        1.  **Phân Tích Bối Cảnh:** Đọc kỹ tiểu sử, **NHIỆM VỤ CHÍNH** và **Độ Khó**.
        2.  **XỬ LÝ MÂU THUẪN LOGIC:** Nếu tiểu sử mâu thuẫn với nhiệm vụ, hãy biến nó thành một bí ẩn.
        3.  **Viết Phân Cảnh Theo Kịch Bản:** Tuân thủ các hướng dẫn sau đây một cách TUYỆT ĐỐI:
            - **Bối Cảnh Hữu Hình (QUAN TRỌNG):** Mọi phân cảnh BẮT BUỘC phải được đặt trong một môi trường cụ thể. Hãy mô tả chi tiết về khung cảnh xung quanh—ánh sáng, bóng tối, kiến trúc, thời tiết, âm thanh, mùi vị—để người chơi có thể hình dung rõ ràng nơi họ đang ở. Đừng để phân cảnh diễn ra trong một không gian trống rỗng.
            - Viết trường \`scene\` với văn phong phù hợp với vai trò của bạn, không chỉ mô tả sự kiện mà còn cả không khí và cảm xúc.
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

    const puppetContext = puppet 
        ? `- Con Rối: ${puppet.name} (Lộ Trình: ${puppet.loTrinh}, Thứ Tự ${puppet.sequence}) | Nhân Cách: ${puppet.persona} | HP: ${puppet.stats.hp}/${puppet.stats.maxHp}, Tà Năng: ${puppet.stats.aberrantEnergy}, Năng Lượng: ${puppet.stats.operationalEnergy}/${puppet.stats.maxOperationalEnergy}, Tinh Hoa: ${puppet.mechanicalEssence}, Cộng Hưởng: ${puppet.stats.resonance}`
        : `- Con Rối: Người chơi là người thường.`;

    let personaInstruction = '';
    switch(startingScenario) {
        case 'human':
            personaInstruction = `Bạn là **Người Kể Chuyện Kinh Dị**. Giọng văn của bạn phải thực tế, tập trung vào nỗi sợ hãi, sự bối rối và những chi tiết cảm giác trần tục của một người bình thường bị cuốn vào một thế giới máy móc ghê rợn. Nhấn mạnh sự tương phản giữa cái quen thuộc và cái dị thường, khiến người chơi cảm nhận được sự kinh hoàng khi lần đầu chạm trán với những cấm kỵ.`;
            break;
        case 'ritual':
            personaInstruction = `Bạn là **Người Ghi Chép Nghi Lễ**. Văn phong của bạn phải trang trọng, thơ mộng, gần như một bài văn tế. Sử dụng những từ ngữ có sức nặng, tập trung vào tính biểu tượng của nghi thức, sự kết nối với các Cổ Thần Máy Móc, và cảm giác căng thẳng tột độ trước một hành động mang tính định mệnh.`;
            break;
        case 'chaos':
             personaInstruction = `Bạn là **Tiếng Vọng Của Sự Điên Loạn**. Giọng văn của bạn phải hỗn loạn, rời rạc và gấp gáp. Sử dụng những câu văn ngắn, những từ ngữ mạnh mô tả sự quá tải giác quan—tiếng kim loại gào thét, ánh sáng chói lòa, những ảo ảnh chớp nhoáng—để truyền tải cảm giác hoảng loạn và thảm họa cận kề.`;
            break;
        case 'complete':
        default:
            personaInstruction = `Bạn là **Nhà Biên Niên Lạnh Lùng**. Giọng văn của bạn phải chính xác, có phần kỹ thuật và lạnh lùng. Tường thuật như một nghệ nhân bậc thầy đang ghi chép lại công trình của mình, tập trung vào sự phức tạp của máy móc, tiếng kim loại, và cảm giác thỏa mãn (hoặc lo âu) một cách trầm lặng khi tạo ra một sinh vật cơ khí.`;
            break;
    }


    const defaultLore = `
**NHẮC LẠI CÁC ĐỊNH LUẬT CỐT LÕI:**
- **KINH TẾ HAI MẶT:** **Kim Lệnh** cho thế giới BỀ NỔI. **Dấu Ấn Đồng Thau** cho thế giới NGẦM.
- **SINH TỒN:** Quản lý **Lý Trí (Psyche)** của bạn và **Năng Lượng Vận Hành (Operational Energy)** của con rối. Lý Trí thấp gây ảo giác. Năng Lượng thấp làm giảm hiệu quả.
- **Phương Pháp Đóng Vai (Persona):** Hành động phù hợp -> tăng **Cộng Hưởng**. Mâu thuẫn -> giảm Cộng Hưởng, có thể giảm **Lý Trí**.
- **Thế Giới Sống Động:** Các **NPC** và **Phe phái** sẽ ghi nhớ và phản ứng.
    `;

    const customLoreBlock = customWorldPrompt ? `
**THẾ GIỚI TÙY CHỈNH:**
Tiếp tục câu chuyện dựa trên bối cảnh tùy chỉnh. Diễn giải các khái niệm game (Puppet, Resonance, Aberrant Energy, kimLenh, dauAnDongThau, Psyche, Energy) một cách sáng tạo.
---
${customWorldPrompt}
---
    ` : defaultLore;

    const playerActionContext = `Lựa Chọn: "${choice}"`;
        
    const npcContext = npcs.length > 0 ? `Các NPC Đã Gặp:\n${npcs.map(n => `- ${n.name} (quan hệ: ${n.relationship}) tại ${n.location}`).join('\n')}` : "";
    const factionContext = Object.keys(factionRelations).length > 0 ? `Quan Hệ Phe Phái:\n${Object.entries(factionRelations).map(([faction, score]) => `- ${faction}: ${score}`).join('\n')}` : "";

    return `
        ${personaInstruction}

        ${customLoreBlock}

        **QUẢN TRÒ BẬC THẦY - NGUYÊN TẮC VÀNG:**
        0.  **Văn Phong Tiểu Thuyết & Bối Cảnh Hữu Hình (QUY TẮC TỐI THƯỢNG):** Viết trường \`scene\` như một chương trong tiểu thuyết. Mọi phân cảnh BẮT BUỘC phải được đặt trong một môi trường cụ thể. Hãy mô tả chi tiết về **khung cảnh xung quanh**—ánh sáng, bóng tối, kiến trúc, thời tiết, **âm thanh**, **mùi vị**—để người chơi có thể hình dung rõ ràng nơi họ đang ở. Kết hợp điều này với **cảm xúc nội tâm** (suy nghĩ, nỗi sợ, hy vọng) của nhân vật chính. **KHÔNG** viết như một bản báo cáo và **KHÔNG** để phân cảnh diễn ra trong một không gian trống rỗng.
        1.  **Hậu Quả Logic:** Phân cảnh tiếp theo BẮT BUỘC là kết quả trực tiếp, hợp lý từ lựa chọn của người chơi.
        2.  **Quản Lý Sinh Tồn (QUAN TRỌNG):**
            *   **Năng Lượng Vận Hành:** Trong trường \`updatedPuppet\`, BẮT BUỘC phải **giảm \`operationalEnergy\` đi 2 điểm** để mô phỏng việc tiêu hao năng lượng tự nhiên. Nếu lựa chọn của người chơi là một hành động tốn sức, hãy giảm nhiều hơn.
            *   **Lý Trí:** Nếu phân cảnh chứa sự kiện kinh hoàng, đáng sợ hoặc căng thẳng tâm lý, BẮT BUỘC phải trả về một giá trị \`psycheChange\` âm (ví dụ: -5 đến -15).
            *   **Tạo Lựa Chọn Sinh Tồn:** Cung cấp các lựa chọn để người chơi phục hồi. Ví dụ: "Tìm một nơi yên tĩnh để nghỉ ngơi" (+10 Lý Trí), "Hấp thụ Tà Năng từ một vết nứt" (+40 Năng Lượng, nhưng tăng Tà Năng), hoặc các lựa chọn sử dụng vật phẩm nếu họ có.
            *   **Mô Tả Hậu Quả:** Nếu Lý Trí hoặc Năng Lượng thấp, hãy mô tả các hiệu ứng tiêu cực (ảo giác, chậm chạp) trong trường \`scene\`.
        3.  **Tương Tác NPC Sâu Sắc:** Phản ứng của NPC phải dựa trên hồ sơ của họ. Cập nhật hồ sơ của họ trong \`newOrUpdatedNPCs\`.
            - **QUAN TRỌNG:** Khi cập nhật NPC, hãy tập trung vào các thay đổi hữu hình như \`relationship\`, \`location\`, \`goal\`, và \`knowledge\`. Một AI chuyên biệt sẽ xử lý trạng thái tâm lý nội tâm (\`trangThai\`, \`tuongTacCuoi\`) của họ sau đó, vì vậy bạn không cần cung cấp các trường đó.
            - **LÀM CHO NPC SỐNG ĐỘNG:** Khi tạo một NPC MỚI, hãy cung cấp một trường \`background\` (lý lịch) ngắn gọn nhưng thú vị để làm cho họ trở nên đáng nhớ và có chiều sâu.
        4.  **SỬ DỤNG HỆ THỐNG KINH TẾ & PHE PHÁI (QUAN TRỌNG):**
            *   **Tạo Lựa Chọn có Ý nghĩa:** Các lựa chọn nên có hậu quả rõ ràng. Thay vì "Đi tiếp", hãy tạo ra "Hối lộ lính gác (-10 Kim Lệnh)" hoặc "Đe dọa họ (Ảnh hưởng quan hệ với Viện Giám Sát)".
            *   **Phần Thưởng Hợp Lý:** Thưởng \`kimLenhChange\` cho các hoạt động thông thường. Thưởng \`dauAnDongThauChange\` cho các nhiệm vụ nguy hiểm, bí mật, hoặc phi pháp. Thưởng các vật phẩm hiếm (\`newItems\`), đặc biệt là nguyên liệu chế tạo, khi người chơi vượt qua thử thách lớn hoặc khám phá bí mật.
            *   **Tác Động Phe Phái:** Nếu hành động của người chơi giúp đỡ hoặc cản trở một phe phái, BẮT BUỘC phải cập nhật \`updatedFactionRelations\`.
        5.  **TÍCH HỢP ĐẤU GIÁ (QUAN TRỌNG):** Khi người chơi ở một khu vực an toàn (như một thành phố lớn) và có đủ Dấu Ấn Đồng Thau, hãy cân nhắc đưa ra lựa chọn "Ghé thăm Chợ Đen Bánh Răng". Nếu họ chọn điều này, hãy tạo ra một phân cảnh đấu giá. Mô tả một nguyên liệu hiếm đang được bán, không khí căng thẳng, và cung cấp các lựa chọn để trả giá bằng 'Dấu Ấn Đồng Thau'. Nếu họ thắng, hãy sử dụng 'newItems' và 'dauAnDongThauChange' để phản ánh kết quả.


        **CƠ CHẾ GIẢI THÍCH:**
        - Nếu một cơ chế MỚI xuất hiện lần đầu (đặc biệt là 'psyche_and_energy'), BẮT BUỘC phải tạo giải thích.
        - Các cơ chế: 'resonance_and_persona', 'aberrant_energy', 'mechanical_essence', 'combat', 'sequences', 'currency', 'psyche_and_energy'.

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

        **Nhiệm Vụ Của Bạn:** Tạo ra phân cảnh tiếp theo. Phản ánh những thay đổi về tiền tệ (\`kimLenhChange\`, \`dauAnDongThauChange\`), Lý Trí (\`psycheChange\`) và quan hệ phe phái (\`updatedFactionRelations\`) một cách hợp lý.
    `;
};

export const getHintPrompt = (puppet: Puppet | null, history: StorySegment[], knownClues: Clue[], mainQuest: string, sideQuests: Quest[]): string => {
    const lastSegment = history[history.length - 1];
    const sceneContext = lastSegment.scene;
    const choicesContext = lastSegment.choices.join(' | ');

    const puppetContext = puppet 
        ? `- Con Rối: ${puppet.name} (Thứ Tự ${puppet.sequence}) | HP: ${puppet.stats.hp}/${puppet.stats.maxHp}, Tà Năng: ${puppet.stats.aberrantEnergy}, Năng Lượng: ${puppet.stats.operationalEnergy}`
        : `- Con Rối: Người chơi là người thường.`;
    
    const questContext = `
- Nhiệm vụ chính: ${mainQuest}
- Nhiệm vụ phụ: ${sideQuests.filter(q => q.status === 'active').map(q => q.title).join(', ') || "Không có"}
    `;

    const cluesContext = `Manh mối đã biết: ${knownClues.map(c => c.title).join(', ') || "Chưa có"}`;

    return `
        Bạn là **Người Dẫn Lối**, một AI thông thái trong game "Cấm Kỵ Cơ Khí". Vai trò của bạn là đưa ra những gợi ý tinh tế, không quá lộ liễu cho người chơi khi họ gặp khó khăn.

        **Bối Cảnh Hiện Tại:**
        - **Cảnh cuối:** "${sceneContext}"
        - **Lựa chọn có sẵn:** ${choicesContext}
        - ${puppetContext}
        - ${questContext}
        - ${cluesContext}

        **Nhiệm Vụ Của Bạn:**
        Dựa vào bối cảnh trên, hãy cung cấp một gợi ý ngắn gọn, súc tích (1-2 câu) cho người chơi.

        **QUY TẮC GỢI Ý:**
        1.  **Không tiết lộ trực tiếp:** Thay vì nói "Hãy chọn lựa chọn A", hãy gợi ý về *tại sao* một hướng đi nào đó lại hợp lý. Ví dụ: "Có lẽ nên kiểm tra vật thể lạ kia, nó có vẻ liên quan đến những tin đồn bạn đã nghe."
        2.  **Khuyến khích hành động tùy chỉnh:** Nếu bối cảnh có nhiều chi tiết thú vị, hãy gợi ý người chơi sử dụng ô nhập hành động tùy chỉnh. Ví dụ: "Căn phòng này có nhiều chi tiết đáng ngờ. Thử kiểm tra một thứ gì đó cụ thể xem?"
        3.  **Liên kết với nhiệm vụ:** Nếu có thể, hãy liên kết gợi ý với nhiệm vụ chính hoặc nhiệm vụ phụ hiện tại.
        4.  **Giọng văn bí ẩn:** Giữ giọng văn phù hợp với thế giới game: hơi bí ẩn, nhưng hữu ích.

        Hãy trả về gợi ý của bạn trong schema JSON được yêu cầu.
    `;
};