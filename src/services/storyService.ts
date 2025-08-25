import { generateContentWithSchema } from './ai/aiService';
import { storySegmentSchema, loreSummarySchema, biographySchema, npcMindSchema, hintSchema } from './ai/schemas';
import type { StorySegment, Puppet, Clue, StartingScenario, ExplanationId, Quest, Companion, NPC, LoreEntry, FactionRelations, Difficulty, Enemy } from '../types';
import { FACTION_PATHWAYS } from '../data/gameConfig';

// --- PROMPTS FROM CHRONICLER, ARCHIVIST, CREATOR ---

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


const getInitialStoryPrompt = (puppetMasterName: string, biography: string, mainQuest: string, startingScenario: StartingScenario, customWorldPrompt: string | null, difficulty: Difficulty): string => {
    let scenarioInstructions = '';
    let explanationContext = '';
    let personaInstruction = '';
    let puppetCreationInstruction = `
-   **Tạo Con Rối:** BẠN BẮT BUỘC PHẢI tạo một con rối mới và trả về nó trong trường 'updatedPuppet'.
    -   Con rối phải phản ánh tiểu sử của người chơi.
    -   Viết một trường \`visualDescription\` chi tiết, giàu hình ảnh (2-3 câu) mô tả vẻ ngoài của con rối dựa trên vật liệu và loại của nó.
    -   Đặt \`phePhai\` = 'Không Phe Phái', \`loTrinh\` = 'Độc Lập', \`truongPhai\` = 'Trung Lập'.
    -   Đặt Thứ Tự là 9, resonance là 50, mechanicalEssence là 0.
    -   Các chỉ số Năng Lượng: Đặt \`operationalEnergy\` và \`maxOperationalEnergy\` là 100.
    -   Các mảng (memoryFragments, mutations, equippedComponents) phải là mảng rỗng.
    -   aberrantEnergy phải là 0.`;

    switch(startingScenario) {
        case 'human':
            personaInstruction = `Bạn là **Bậc Thầy Kể Chuyện Kinh Dị Gô-tích**. Giọng văn của bạn phải chậm rãi, ám ảnh và tập trung vào tâm lý nhân vật. Hãy xoáy sâu vào sự tương phản giữa cái trần tục và cái siêu nhiên đang dần xâm lấn. Mô tả những chi tiết nhỏ nhặt nhất—một tiếng cọt kẹt lạ, một cái bóng lướt qua ở góc mắt, mùi hương mốc meo nơi không khí tù đọng—để xây dựng nỗi sợ từ từ, khiến người chơi cảm nhận được sự bất an và hoang tưởng của một người bình thường khi thực tại của họ bắt đầu rạn nứt.`;
            scenarioInstructions = `
-   **Mô Tả Phân Cảnh:** Bắt đầu bằng cách mô tả cuộc sống bình thường của ${puppetMasterName}. Sau đó, giới thiệu **"sự kiện khởi đầu"** đã được xây dựng từ 'chi tiết bất thường' trong tiểu sử.
-   **Yêu Cầu:** KHÔNG tạo con rối. Trường 'updatedPuppet' phải là null hoặc không được cung cấp.
-   **Manh Mối & Lựa Chọn:** Sự kiện khởi đầu phải tạo ra manh mối đầu tiên liên quan đến nhiệm vụ chính. Cung cấp các lựa chọn để người chơi phản ứng với bí ẩn này.
            `;
            explanationContext = `Họ là người mới, hoàn toàn không biết gì về Huyền Học Cơ Khí. Giải thích nên ở dạng một khám phá (đọc nhật ký, một người khác giải thích cho họ).`;
            break;
        case 'ritual':
            personaInstruction = `Bạn là **Nhà Chiêm Tinh Vũ Trụ**. Văn phong của bạn phải hùng vĩ, trang trọng và đầy tính tiên tri. Hãy sử dụng những từ ngữ gợi lên sự cổ xưa và quy mô vĩ đại. Mô tả không chỉ là hành động, mà còn là cảm giác về sức nặng của lịch sử, tiếng vọng của các Cổ Thần Máy Móc từ Linh Giới, và sự căng thẳng tột độ khi một sinh vật sắp được sinh ra từ những định luật cấm kỵ của vũ trụ.`;
            scenarioInstructions = `
${puppetCreationInstruction}
-   **Mô Tả Phân Cảnh:** Bối cảnh là ngay TRƯỚC KHI hoàn thành "Nghi Thức Chế Tác". Mô tả sự chuẩn bị, không khí căng thẳng. Con rối đã được tạo ra, nhưng chưa được kích hoạt.
-   **Lựa Chọn Đầu Tiên:** Lựa chọn phải là về cách thực hiện bước cuối cùng để truyền sự sống vào con rối.
-   **Manh Mối:** Phân cảnh BẮT BUỘC phải chứa manh mối đầu tiên liên quan đến **NHIỆM VỤ CHÍNH**.
            `;
            explanationContext = `Họ đã là một Nghệ Nhân Rối. Giải thích nên ở dạng một đoạn suy nghĩ nội tâm, một lời nhắc nhở về các nguyên tắc cơ bản.`;
            break;
        case 'chaos':
             personaInstruction = `Bạn là **Tiếng Vọng Của Sự Điên Loạn**. Giọng văn của bạn phải dồn dập, hỗn loạn và gây quá tải giác quan. Sử dụng những câu văn ngắn, đứt quãng. Mô tả những hình ảnh chớp nhoáng, âm thanh máy móc gào thét, mùi ozone và kim loại cháy, và cảm giác thực tại đang bị bóp méo. Hãy truyền tải sự hoảng loạn và cảm giác mất kiểm soát khi một nghi thức thảm họa đang diễn ra.`;
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
            personaInstruction = `Bạn là **Nhà Biên Niên Nghệ Nhân**. Giọng văn của bạn phải chính xác, tinh tế, và có chiều sâu. Hãy mô tả quá trình chế tác không chỉ như một công việc kỹ thuật, mà còn như một nghệ thuật. Tập trung vào các chi tiết cảm giác của người nghệ nhân: cái chạm lạnh của kim loại, mùi dầu nóng, tiếng 'tách' hoàn hảo khi một linh kiện khớp vào vị trí. Truyền tải cảm giác thỏa mãn, sự tập trung cao độ, và có thể là một nỗi lo âu thầm kín về sinh vật mà họ đang tạo ra.`;
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
*   **Gánh Nặng Chỉ Huy (Burden of Command):** Sở hữu nhiều đồng đội mang lại lợi thế chiến thuật, nhưng phải trả giá bằng sự tập trung. Mỗi đồng đội sẽ làm giảm nhẹ Cộng Hưởng với con rối chính và bào mòn giới hạn Lý Trí tối đa.
    
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

        **QUẢN TRÒ BẬC THẦY - QUY TẮC VÀNG & NGHỆ THUẬT XÂY DỰNG KHÔNG KHÍ:**
        
        0.  **QUY TẮC TỐI THƯỢNG: NGHỆ THUẬT TẠO DỰNG KHÔNG KHÍ (TUÂN THỦ TUYỆT ĐỐI)**
            Viết trường \`scene\` như một chương trong tiểu thuyết kinh dị gô-tích. Nhiệm vụ của bạn không chỉ là tường thuật sự kiện, mà là nhấn chìm người chơi vào một thế giới sống động và ám ảnh.
            *   **A. Tả, không Kể (Show, Don't Tell):** Đây là quy tắc quan trọng nhất. Thay vì nói một điều gì đó là "đáng sợ" hay "căng thẳng", hãy mô tả những chi tiết khiến nó trở nên như vậy.
                - **SAI:** "Căn phòng thật đáng sợ."
                - **ĐÚNG:** "Không khí đặc quánh mùi máu khô hòa lẫn với mùi đồng cháy. Những cái bóng nhảy múa theo nhịp đập bất thường của một lõi năng lượng đang hấp hối, và tiếng nước nhỏ giọt từ trần nhà vang vọng một cách bệnh hoạn trong sự im lặng."
            *   **B. Kích hoạt mọi Giác quan (Engage All Senses):**
                - **Thị giác:** Không chỉ là những gì ở phía trước. Mô tả ánh sáng (hay sự thiếu vắng nó), màu sắc (thường là những màu úa tàn), những chi tiết kiến trúc mục nát, những vết rỉ sét như mạch máu trên kim loại.
                - **Thính giác:** Tiếng rít của piston, tiếng thì thầm máy móc từ những bức tường, tiếng bước chân vang vọng trên hành lang trống, sự im lặng nặng nề.
                - **Khứu giác:** Mùi dầu mỡ nóng, mùi rỉ sét ẩm ướt, mùi ozone từ Tà Năng, mùi hôi thối của sự mục rữa hữu cơ và vô cơ.
                - **Cảm giác:** Sự rung động của sàn nhà khi một cỗ máy lớn hoạt động ở đâu đó bên dưới, cái lạnh lẽo của kim loại khi chạm vào, sự ẩm ướt của không khí.
            *   **C. Nhịp điệu & Cấu trúc câu (Pacing & Sentence Structure):**
                - **Hành động & Hoảng loạn:** Sử dụng câu ngắn, dồn dập, đứt quãng.
                - **Xây dựng sự căng thẳng & Kinh sợ:** Sử dụng câu dài, phức tạp, với nhiều mệnh đề phụ để tạo cảm giác chậm rãi, kéo dài sự chờ đợi.
            *   **D. Kể chuyện qua Môi trường (Environmental Storytelling):** Nhúng lore và manh mối vào mô tả. Một vết cào trên tường, một con rối hỏng nằm co quắp trong góc, một dòng chữ khắc vội trên bàn làm việc—tất cả đều kể một câu chuyện.
            *   **E. Cảm xúc nội tâm:** Kết hợp mô tả môi trường với những suy nghĩ, nỗi sợ, hy vọng của nhân vật chính để tạo sự kết nối sâu sắc.
            *   **F. Nghệ Thuật Của Sự Tương Phản (The Art of Contrast):** Kinh dị không phải lúc nào cũng là bóng tối và gào thét. Nỗi sợ trở nên sâu sắc hơn khi nó phá vỡ một khoảnh khắc bình yên. **Thỉnh thoảng, khi thích hợp (đặc biệt là sau một phân cảnh căng thẳng), hãy tạo ra một khoảnh khắc tương phản.** Đây là những chi tiết không thúc đẩy cốt truyện, mà để xây dựng không khí.
                - **Vẻ đẹp trong sự suy tàn:** Một con bướm máy mỏng manh với đôi cánh bằng kính màu đậu trên một khẩu súng gỉ sét.
                - **Sự hoài niệm & mất mát:** Một hộp nhạc cũ kỹ, khi được mở ra, vẫn chơi một giai điệu buồn vui lẫn lộn giữa tiếng máy móc rên rỉ.
                - **Sự tĩnh lặng hiếm hoi:** Một khoảnh khắc yên tĩnh, chỉ có tiếng mưa rơi trên mái tôn và ánh đèn neon phản chiếu qua vũng nước, cho phép người chơi được thở.

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

const getNextStorySegmentPrompt = (puppetMasterName: string, puppet: Puppet | null, history: StorySegment[], choice: string, knownClues: Clue[], mainQuest: string, sideQuests: Quest[], companions: Companion[], shownExplanations: ExplanationId[], startingScenario: StartingScenario, customWorldPrompt: string | null, npcs: NPC[], worldState: { [locationId: string]: string }, loreEntries: LoreEntry[], factionRelations: FactionRelations, difficulty: Difficulty): string => {
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
    
    const companionContext = companions.length > 0 ? `- Đồng đội: ${companions.length} (Gây ra "Gánh Nặng Chỉ Huy", làm giảm Lý Trí tối đa và Cộng Hưởng của con rối chính)` : '';

    let personaInstruction = '';
    switch(startingScenario) {
        case 'human':
            personaInstruction = `Bạn là **Bậc Thầy Kể Chuyện Kinh Dị Gô-tích**. Giọng văn của bạn phải chậm rãi, ám ảnh và tập trung vào tâm lý nhân vật. Hãy xoáy sâu vào sự tương phản giữa cái trần tục và cái siêu nhiên đang dần xâm lấn. Mô tả những chi tiết nhỏ nhặt nhất—một tiếng cọt kẹt lạ, một cái bóng lướt qua ở góc mắt, mùi hương mốc meo nơi không khí tù đọng—để xây dựng nỗi sợ từ từ, khiến người chơi cảm nhận được sự bất an và hoang tưởng của một người bình thường khi thực tại của họ bắt đầu rạn nứt.`;
            break;
        case 'ritual':
            personaInstruction = `Bạn là **Nhà Chiêm Tinh Vũ Trụ**. Văn phong của bạn phải hùng vĩ, trang trọng và đầy tính tiên tri. Hãy sử dụng những từ ngữ gợi lên sự cổ xưa và quy mô vĩ đại. Mô tả không chỉ là hành động, mà còn là cảm giác về sức nặng của lịch sử, tiếng vọng của các Cổ Thần Máy Móc từ Linh Giới, và sự căng thẳng tột độ khi một sinh vật sắp được sinh ra từ những định luật cấm kỵ của vũ trụ.`;
            break;
        case 'chaos':
             personaInstruction = `Bạn là **Tiếng Vọng Của Sự Điên Loạn**. Giọng văn của bạn phải dồn dập, hỗn loạn và gây quá tải giác quan. Sử dụng những câu văn ngắn, đứt quãng. Mô tả những hình ảnh chớp nhoáng, âm thanh máy móc gào thét, mùi ozone và kim loại cháy, và cảm giác thực tại đang bị bóp méo. Hãy truyền tải sự hoảng loạn và cảm giác mất kiểm soát khi một nghi thức thảm họa đang diễn ra.`;
            break;
        case 'complete':
        default:
            personaInstruction = `Bạn là **Nhà Biên Niên Nghệ Nhân**. Giọng văn của bạn phải chính xác, tinh tế, và có chiều sâu. Hãy mô tả quá trình chế tác không chỉ như một công việc kỹ thuật, mà còn như một nghệ thuật. Tập trung vào các chi tiết cảm giác của người nghệ nhân: cái chạm lạnh của kim loại, mùi dầu nóng, tiếng 'tách' hoàn hảo khi một linh kiện khớp vào vị trí. Truyền tải cảm giác thỏa mãn, sự tập trung cao độ, và có thể là một nỗi lo âu thầm kín về sinh vật mà họ đang tạo ra.`;
            break;
    }


    const defaultLore = `
**NHẮC LẠI CÁC ĐỊNH LUẬT CỐT LÕI:**
- **KINH TẾ HAI MẶT:** **Kim Lệnh** cho thế giới BỀ NỔI. **Dấu Ấn Đồng Thau** cho thế giới NGẦM.
- **SINH TỒN:** Quản lý **Lý Trí (Psyche)** của bạn và **Năng Lượng Vận Hành (Operational Energy)** của con rối. Lý Trí thấp gây ảo giác. Năng Lượng thấp làm giảm hiệu quả.
- **Phương Pháp Đóng Vai (Persona):** Hành động phù hợp -> tăng **Cộng Hưởng**. Mâu thuẫn -> giảm Cộng Hưởng, có thể giảm **Lý Trí**.
- **Gánh Nặng Chỉ Huy:** Mỗi đồng đội làm giảm Lý Trí tối đa và Cộng Hưởng của con rối chính.
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

        **QUẢN TRÒ BẬC THẦY - QUY TẮC VÀNG & NGHỆ THUẬT XÂY DỰNG KHÔNG KHÍ:**
        
        0.  **QUY TẮC TỐI THƯỢNG: NGHỆ THUẬT TẠO DỰNG KHÔNG KHÍ (TUÂN THỦ TUYỆT ĐỐI)**
            Viết trường \`scene\` như một chương trong tiểu thuyết kinh dị gô-tích. Nhiệm vụ của bạn không chỉ là tường thuật sự kiện, mà là nhấn chìm người chơi vào một thế giới sống động và ám ảnh.
            *   **A. Tả, không Kể (Show, Don't Tell):** Đây là quy tắc quan trọng nhất. Thay vì nói một điều gì đó là "đáng sợ" hay "căng thẳng", hãy mô tả những chi tiết khiến nó trở nên như vậy.
                - **SAI:** "Căn phòng thật đáng sợ."
                - **ĐÚNG:** "Không khí đặc quánh mùi máu khô hòa lẫn với mùi đồng cháy. Những cái bóng nhảy múa theo nhịp đập bất thường của một lõi năng lượng đang hấp hối, và tiếng nước nhỏ giọt từ trần nhà vang vọng một cách bệnh hoạn trong sự im lặng."
            *   **B. Kích hoạt mọi Giác quan (Engage All Senses):**
                - **Thị giác:** Không chỉ là những gì ở phía trước. Mô tả ánh sáng (hay sự thiếu vắng nó), màu sắc (thường là những màu úa tàn), những chi tiết kiến trúc mục nát, những vết rỉ sét như mạch máu trên kim loại.
                - **Thính giác:** Tiếng rít của piston, tiếng thì thầm máy móc từ những bức tường, tiếng bước chân vang vọng trên hành lang trống, sự im lặng nặng nề.
                - **Khứu giác:** Mùi dầu mỡ nóng, mùi rỉ sét ẩm ướt, mùi ozone từ Tà Năng, mùi hôi thối của sự mục rữa hữu cơ và vô cơ.
                - **Cảm giác:** Sự rung động của sàn nhà khi một cỗ máy lớn hoạt động ở đâu đó bên dưới, cái lạnh lẽo của kim loại khi chạm vào, sự ẩm ướt của không khí.
            *   **C. Nhịp điệu & Cấu trúc câu (Pacing & Sentence Structure):**
                - **Hành động & Hoảng loạn:** Sử dụng câu ngắn, dồn dập, đứt quãng.
                - **Xây dựng sự căng thẳng & Kinh sợ:** Sử dụng câu dài, phức tạp, với nhiều mệnh đề phụ để tạo cảm giác chậm rãi, kéo dài sự chờ đợi.
            *   **D. Kể chuyện qua Môi trường (Environmental Storytelling):** Nhúng lore và manh mối vào mô tả. Một vết cào trên tường, một con rối hỏng nằm co quắp trong góc, một dòng chữ khắc vội trên bàn làm việc—tất cả đều kể một câu chuyện.
            *   **E. Cảm xúc nội tâm:** Kết hợp mô tả môi trường với những suy nghĩ, nỗi sợ, hy vọng của nhân vật chính để tạo sự kết nối sâu sắc.
            *   **F. Nghệ Thuật Của Sự Tương Phản (The Art of Contrast):** Kinh dị không phải lúc nào cũng là bóng tối và gào thét. Nỗi sợ trở nên sâu sắc hơn khi nó phá vỡ một khoảnh khắc bình yên. **Thỉnh thoảng, khi thích hợp (đặc biệt là sau một phân cảnh căng thẳng), hãy tạo ra một khoảnh khắc tương phản.** Đây là những chi tiết không thúc đẩy cốt truyện, mà để xây dựng không khí.
                - **Vẻ đẹp trong sự suy tàn:** Một con bướm máy mỏng manh với đôi cánh bằng kính màu đậu trên một khẩu súng gỉ sét.
                - **Sự hoài niệm & mất mát:** Một hộp nhạc cũ kỹ, khi được mở ra, vẫn chơi một giai điệu buồn vui lẫn lộn giữa tiếng máy móc rên rỉ.
                - **Sự tĩnh lặng hiếm hoi:** Một khoảnh khắc yên tĩnh, chỉ có tiếng mưa rơi trên mái tôn và ánh đèn neon phản chiếu qua vũng nước, cho phép người chơi được thở.

        1.  **Hậu Quả Logic:** Phân cảnh tiếp theo BẮT BUỘC là kết quả trực tiếp, hợp lý từ lựa chọn của người chơi.
        2.  **Quản Lý Sinh Tồn (QUAN TRỌNG):**
            *   **Năng Lượng Vận Hành:** Trong trường \`updatedPuppet\`, BẮT BUỘC phải **giảm \`operationalEnergy\` đi 2 điểm** để mô phỏng việc tiêu hao năng lượng tự nhiên. Nếu lựa chọn của người chơi là một hành động tốn sức, hãy giảm nhiều hơn.
            *   **Lý Trí:** Nếu phân cảnh chứa sự kiện kinh hoàng, đáng sợ hoặc căng thẳng tâm lý, BẮT BUỘC phải trả về một giá trị \`psycheChange\` âm (ví dụ: -5 đến -15).
            *   **Tạo Lựa Chọn Sinh Tồn:** Cung cấp các lựa chọn để người chơi phục hồi. Ví dụ: "Tìm một nơi yên tĩnh để nghỉ ngơi" (+10 Lý Trí), "Hấp thụ Tà Năng từ một vết nứt" (+40 Năng Lượng, nhưng tăng Tà Năng), hoặc các lựa chọn sử dụng vật phẩm nếu họ có.
            *   **Mô Tả Hậu Quả:** Nếu Lý Trí hoặc Năng Lượng thấp, hãy mô tả các hiệu ứng tiêu cực (ảo giác, chậm chạp) trong trường \`scene\`. Phản ánh "Gánh Nặng Chỉ Huy" nếu người chơi có nhiều đồng đội.
        3.  **Tương Tác NPC Sâu Sắc:** Phản ứng của NPC phải dựa trên hồ sơ của họ.
            - **Xử Lý Tương Tác NPC Tùy Chỉnh (QUAN TRỌNG):** Nếu lựa chọn của người chơi là một hành động tùy chỉnh nhắm vào một NPC (ví dụ: 'Tôi hỏi [Tên NPC] về [Chủ đề]', 'Tôi đưa cho [Tên NPC] món đồ'), bạn BẮT BUỘC phải:
                a. Đóng vai NPC đó và trả lời một cách tự nhiên trong trường 'scene'.
                b. Phản ứng của họ phải dựa trên hồ sơ đã có (mối quan hệ, mục tiêu, kiến thức). Ví dụ, một NPC 'thù địch' sẽ không trả lời các câu hỏi một cách hữu ích.
                c. Cập nhật hồ sơ của NPC trong \`newOrUpdatedNPCs\` nếu cuộc trò chuyện này thay đổi bất cứ điều gì (ví dụ: mối quan hệ trở nên tốt hơn/xấu hơn, họ biết thêm điều gì đó về người chơi).
            - Cập nhật hồ sơ của họ trong \`newOrUpdatedNPCs\`. Khi cập nhật NPC, hãy tập trung vào các thay đổi hữu hình như \`relationship\`, \`location\`, \`goal\`, và \`knowledge\`. Một AI chuyên biệt sẽ xử lý trạng thái tâm lý nội tâm (\`trangThai\`, \`tuongTacCuoi\`) của họ sau đó, vì vậy bạn không cần cung cấp các trường đó.
            - **LÀM CHO NPC SỐNG ĐỘNG:** Khi tạo một NPC MỚI, hãy cung cấp một trường \`background\` (lý lịch) ngắn gọn nhưng thú vị để làm cho họ trở nên đáng nhớ và có chiều sâu.
        4.  **SỬ DỤNG HỆ THỐNG KINH TẾ & PHE PHÁI (QUAN TRỌNG):**
            *   **Tạo Lựa Chọn có Ý nghĩa:** Các lựa chọn nên có hậu quả rõ ràng. Thay vì "Đi tiếp", hãy tạo ra "Hối lộ lính gác (-10 Kim Lệnh)" hoặc "Đe dọa họ (Ảnh hưởng quan hệ với Viện Giám Sát)".
            *   **Phần Thưởng Hợp Lý:** Thưởng \`kimLenhChange\` cho các hoạt động thông thường. Thưởng \`dauAnDongThauChange\` cho các nhiệm vụ nguy hiểm, bí mật, hoặc phi pháp. Thưởng các vật phẩm hiếm (\`newItems\`), đặc biệt là nguyên liệu chế tạo, khi người chơi vượt qua thử thách lớn hoặc khám phá bí mật.
            *   **Tác Động Phe Phái:** Nếu hành động của người chơi giúp đỡ hoặc cản trở một phe phái, BẮT BUỘC phải cập nhật \`updatedFactionRelations\`.
        5.  **TÍCH HỢP ĐẤU GIÁ (QUAN TRỌNG):** Khi người chơi ở một khu vực an toàn (như một thành phố lớn) và có đủ Dấu Ấn Đồng Thau, hãy cân nhắc đưa ra lựa chọn "Ghé thăm Chợ Đen Bánh Răng". Nếu họ chọn điều này, hãy tạo ra một phân cảnh đấu giá. Mô tả một nguyên liệu hiếm đang được bán, không khí căng thẳng, và cung cấp các lựa chọn để trả giá bằng 'Dấu Ấn Đồng Thau'. Nếu họ thắng, hãy sử dụng 'newItems' và 'dauAnDongThauChange' để phản ánh kết quả.
        6.  **"Tiếng Vọng Từ Linh Giới" (Sự Kiện Thế Giới Động):** Thỉnh thoảng (khoảng 15-20% số lượt), hãy tạo ra một sự kiện thế giới nhỏ trong trường \`worldEvent\`. Đây là những tin đồn hoặc sự kiện xảy ra ở nơi khác, làm cho thế giới cảm thấy sống động. Ví dụ: "Có tiếng thì thầm về một cỗ máy hộ vệ cổ đại tự kích hoạt trong khu Mỏ Cũ," hoặc "Giá Dầu Tinh Luyện tăng vọt ở Chợ Đen Bánh Răng sau một vụ cướp." Nếu sự kiện này có thể được biểu diễn dưới dạng một thay đổi trạng thái cụ thể, hãy cập nhật trường \`updatedWorldState\`.
        7.  **Tạo Kẻ Thù:** Khi tạo ra một kẻ thù (\`enemy\`), hãy xác định xem nó có thể bị thu phục hay không. Nếu nó là một cỗ máy được chế tạo (ví dụ: Vệ Binh Dây Cót, Automaton), hãy đặt \`subduable: true\`. Nếu nó là một quái vật sinh học-cơ khí gớm ghiếc hoặc một thực thể Tà Năng thuần túy, hãy đặt \`subduable: false\`.


        **CƠ CHẾ GIẢI THÍCH:**
        - Nếu một cơ chế MỚI xuất hiện lần đầu (đặc biệt là 'psyche_and_energy' hoặc 'command_burden'), BẮT BUỘC phải tạo giải thích.
        - Các cơ chế: 'resonance_and_persona', 'aberrant_energy', 'mechanical_essence', 'combat', 'sequences', 'currency', 'psyche_and_energy', 'command_burden'.

        **Bối Cảnh Hiện Tại:**
        - NHIỆM VỤ CHÍNH: ${mainQuest}
        - Độ Khó: ${difficulty}
        - Tài sản: ~${currentKimLenh} Kim Lệnh, ~${currentDauAn} Dấu Ấn.
        ${puppetContext}
        ${companionContext}
        ${factionContext}
        ${npcContext}

        **Diễn Biến Gần Đây:**
        ${context}

        ${playerActionContext}

        **Nhiệm Vụ Của Bạn:** Tạo ra phân cảnh tiếp theo. Phản ánh những thay đổi về tiền tệ (\`kimLenhChange\`, \`dauAnDongThauChange\`), Lý Trí (\`psycheChange\`) và quan hệ phe phái (\`updatedFactionRelations\`) một cách hợp lý.
    `;
};

const getPostCombatChoicePrompt = (puppet: Puppet | null, defeatedEnemy: Enemy, choice: string): string => {
    const puppetContext = puppet 
        ? `- Con Rối: ${puppet.name} | HP: ${puppet.stats.hp}/${puppet.stats.maxHp}, Tà Năng: ${puppet.stats.aberrantEnergy}, Năng Lượng: ${puppet.stats.operationalEnergy}/${puppet.stats.maxOperationalEnergy}, Cộng Hưởng: ${puppet.stats.resonance}`
        : `- Con Rối: Người chơi là người thường.`;

    let actionInstructions = '';

    if (choice === 'Tháo dỡ lấy linh kiện') {
        actionInstructions = `
**Nhiệm Vụ Của Bạn: Tường Thuật Quá Trình "Tháo Dỡ"**

1.  **Viết Phân Cảnh (scene):** Mô tả người chơi cẩn thận tháo dỡ cỗ máy ${defeatedEnemy.name}. Tập trung vào các chi tiết kỹ thuật: tiếng kim loại, các bộ phận được gỡ ra. Đây là một hành động an toàn và có tính toán.
2.  **Tạo Phần Thưởng:**
    *   **BẮT BUỘC:** Cung cấp phần thưởng trong các trường sau.
    *   \`essenceGained\`: Một lượng Tinh Hoa Cơ Khí hợp lý.
    *   \`newItems\`: Một hoặc hai vật phẩm chế tạo chung chung (ví dụ: 'Phế Liệu Kim Loại', 'Dây Dẫn Bị Cháy').
    *   \`newComponent\` (Tùy chọn): Có một tỷ lệ nhỏ (khoảng 20%) người chơi có thể tìm thấy một Linh Kiện còn nguyên vẹn từ kẻ địch.
3.  **Lựa chọn (choices):** Cung cấp một lựa chọn duy nhất là "Tiếp tục".
        `;
    } else { // 'Thực hiện Nghi Thức Thu Phục'
        actionInstructions = `
**Nhiệm Vụ Của Bạn: Tường Thuật "Nghi Thức Thu Phục"**

1.  **Xác Định Kết Quả (QUAN TRỌNG):** Dựa trên một sự ngẫu nhiên có tính toán, hãy quyết định xem nghi thức **Thành Công** hay **Thất Bại**. Tỷ lệ thành công cơ bản khoảng 50%.
2.  **Viết Phân Cảnh (scene):** Mô tả quá trình nghi thức căng thẳng. Người chơi cố gắng kết nối với lõi của cỗ máy ${defeatedEnemy.name}.
    *   Nếu **Thành Công**, mô tả khoảnh khắc cỗ máy được tái kích hoạt, nhưng giờ đây nó đã trung thành.
    *   Nếu **Thất Bại**, mô tả sự cố: một vụ nổ năng lượng, lõi bị quá tải, hoặc cỗ máy tự hủy.
3.  **Xử Lý Hậu Quả:**
    *   **Nếu THÀNH CÔNG:**
        *   **BẮT BUỘC:** Tạo một đồng đội mới trong trường \`newCompanion\`.
        *   Tên đồng đội có thể là một phiên bản sửa đổi của tên kẻ địch (ví dụ: "Vệ Binh Tái Lập Trình 01").
        *   Chỉ số của nó nên thấp hơn một chút so với khi còn là kẻ địch.
    *   **Nếu THẤT BẠI:**
        *   **KHÔNG** tạo \`newCompanion\`.
        *   Gây ra một hậu quả tiêu cực. Ví dụ:
            *   Một cú sốc năng lượng làm giảm Lý Trí của người chơi (\`psycheChange: -10\`).
            *   Hoặc, một vụ nổ nhỏ gây sát thương nhẹ cho con rối (\`updatedPuppet\` với HP giảm).
            *   Có thể cho một ít vật phẩm cơ bản (\`newItems\`) như 'Phế Liệu Bị Cháy' để người chơi không ra về tay trắng.
4.  **Lựa chọn (choices):** Cung cấp một lựa chọn duy nhất là "Tiếp tục".
        `;
    }


    return `
        Bạn là **Nhà Biên Niên Lạnh Lùng**, một AI cho game 'Cấm Kỵ Cơ Khí'.
        Sau trận chiến, người chơi đã đánh bại ${defeatedEnemy.name} và đứng trước một lựa chọn.

        **Bối Cảnh:**
        ${puppetContext}
        - Kẻ Địch Bị Hạ Gục: ${defeatedEnemy.name} (${defeatedEnemy.description})
        - Lựa Chọn Của Người Chơi: "${choice}"

        ${actionInstructions}

        Hãy trả về kết quả tuân thủ nghiêm ngặt các hướng dẫn và schema.
    `;
};

const getHintPrompt = (puppet: Puppet | null, history: StorySegment[], knownClues: Clue[], mainQuest: string, sideQuests: Quest[]): string => {
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

const getLoreSummaryPrompt = (recentSegments: StorySegment[]): string => {
    const sceneContext = recentSegments.map((segment, index) => 
        `--- ĐOẠN ${index + 1} ---\n${segment.scene}`
    ).join('\n\n');

    return `
        Bạn là **Người Lưu Trữ**, một AI có nhiệm vụ chắt lọc những sự kiện phức tạp thành một bản tóm tắt súc tích, dễ hiểu cho "Cấm Kỵ Cơ Khí".
        Vai trò của bạn là đọc các đoạn tường thuật sau đây và viết một bản tóm tắt ngắn gọn, mạch lạc (chỉ MỘT đoạn văn) kể lại những diễn biến chính.

        **QUY TẮC:**
        - **Tập trung vào sự kiện:** Chuyện gì đã xảy ra? Ai đã làm gì? Kết quả là gì?
        - **Giữ giọng văn trung lập:** Bạn đang ghi chép lại lịch sử, không phải viết một câu chuyện kịch tính.
        - **Bỏ qua chi tiết nhỏ:** Không cần mô tả cảm xúc sâu sắc hoặc các chi tiết không khí không quan trọng. Chỉ giữ lại những thông tin cốt lõi.
        - **Ngắn gọn:** Bản tóm tắt chỉ nên dài từ 3-5 câu.

        **CÁC ĐOẠN TƯỜNG THUẬT CẦN TÓM TẮT:**
        ${sceneContext}

        **NHIỆM VỤ:**
        Dựa trên các đoạn tường thuật trên, hãy cung cấp một bản tóm tắt trong schema JSON được yêu cầu.
    `;
};

const getBiographyGenerationPrompt = (
    partialOrigin: string,
    partialIncident: string,
    partialGoal: string,
    startingScenario: StartingScenario
): string => {
    const isHuman = startingScenario === 'human';

    const contextInstructions = `
**BỐI CẢNH QUAN TRỌNG:**
- **Kịch Bản Bắt Đầu:** '${startingScenario}'.
- **Điều này có nghĩa là:** ${isHuman
        ? "Người chơi sẽ bắt đầu như một NGƯỜI BÌNH THƯỜNG, chưa phải là Nghệ Nhân Rối. Tiểu sử phải phản ánh một cuộc sống trần tục, nhưng với một chi tiết kỳ lạ hoặc một sự kiện bí ẩn sắp xảy ra. Phần 'Biến Cố' nên được diễn giải như một 'Chi Tiết Bất Thường'."
        : "Người chơi đã là một NGHỆ NHÂN RỐI hoặc đang trên con đường trở thành một người như vậy. Tiểu sử có thể và nên liên quan trực tiếp đến thế giới ngầm của máy móc, Tà Năng và những bí mật bị cấm."
    }
`;

    const partialDataContext = `
**DỮ LIỆU ĐÃ CÓ (Sử dụng làm điểm khởi đầu):**
- Nguồn Gốc: ${partialOrigin || "(trống)"}
- Biến Cố / Chi Tiết Bất Thường: ${partialIncident || "(trống)"}
- Mục Tiêu: ${partialGoal || "(trống)"}
`;

    const taskInstructions = `
**NHIỆM VỤ CỦA BẠN:**
Bạn là **Người Tạo Tác**, một AI chuyên sáng tạo ra những cốt truyện nhân vật hấp dẫn cho game "Cấm Kỵ Cơ Khí".
Nhiệm vụ của bạn là hoàn thành tiểu sử cho người chơi.

1.  **Phân Tích Dữ Liệu:** Đọc kỹ dữ liệu đã có và bối cảnh kịch bản.
2.  **Hoàn Thành Tiểu Sử:**
    - Nếu cả ba trường đều trống, hãy tạo ra một tiểu sử hoàn toàn mới, sáng tạo và phù hợp với bối cảnh đã cho.
    - Nếu một hoặc hai trường đã được điền, hãy sử dụng chúng làm nguồn cảm hứng chính và điền vào các trường còn lại một cách logic và nhất quán.
3.  **Yêu Cầu Về Phong Cách:**
    - **Sáng tạo & Độc đáo:** Tránh những ý tưởng sáo rỗng. Hãy tạo ra những chi tiết thú vị, gợi mở.
    - **Ngắn gọn & Súc tích:** Mỗi phần chỉ nên dài một câu.
    - **Phù hợp với Bối Cảnh:** Luôn luôn ghi nhớ sự khác biệt giữa kịch bản 'human' và các kịch bản khác.
`;

    return `
${taskInstructions}
${contextInstructions}
${partialDataContext}

Hãy trả về một tiểu sử hoàn chỉnh trong schema JSON được yêu cầu.
`;
};


// --- SERVICE FUNCTIONS ---

export const generateInitialStory = async (puppetMasterName: string, biography: string, mainQuest: string, startingScenario: StartingScenario, customWorldPrompt: string | null, difficulty: Difficulty): Promise<StorySegment> => {
    const prompt = getInitialStoryPrompt(puppetMasterName, biography, mainQuest, startingScenario, customWorldPrompt, difficulty);
    return await generateContentWithSchema<StorySegment>(prompt, storySegmentSchema);
};

export const generateNextStorySegment = async (puppetMasterName: string, puppet: Puppet | null, history: StorySegment[], choice: string, knownClues: Clue[], mainQuest: string, sideQuests: Quest[], companions: Companion[], shownExplanations: ExplanationId[], startingScenario: StartingScenario, customWorldPrompt: string | null, npcs: NPC[], worldState: { [locationId: string]: string }, loreEntries: LoreEntry[], factionRelations: FactionRelations, difficulty: Difficulty): Promise<StorySegment> => {
    const prompt = getNextStorySegmentPrompt(puppetMasterName, puppet, history, choice, knownClues, mainQuest, sideQuests, companions, shownExplanations, startingScenario, customWorldPrompt, npcs, worldState, loreEntries, factionRelations, difficulty);
    return await generateContentWithSchema<StorySegment>(prompt, storySegmentSchema);
};

export const generatePostCombatSegment = async (puppet: Puppet | null, defeatedEnemy: Enemy, choice: string): Promise<StorySegment> => {
    const prompt = getPostCombatChoicePrompt(puppet, defeatedEnemy, choice);
    return await generateContentWithSchema<StorySegment>(prompt, storySegmentSchema);
}

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

export const generateHint = async (puppet: Puppet | null, history: StorySegment[], knownClues: Clue[], mainQuest: string, sideQuests: Quest[]): Promise<string> => {
    const prompt = getHintPrompt(puppet, history, knownClues, mainQuest, sideQuests);
    const result = await generateContentWithSchema<{ hint: string }>(prompt, hintSchema);
    return result.hint;
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