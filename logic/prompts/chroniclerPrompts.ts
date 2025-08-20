
import { INITIAL_PUPPETS, FACTION_PATHWAYS } from '../../data/gameConfig';
import type { Puppet, StorySegment, Clue, StartingScenario, ExplanationId, Quest, Companion, NPC, LoreEntry } from '../../types';

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


export const getInitialStoryPrompt = (puppetMasterName: string, biography: string, mainQuest: string, startingScenario: StartingScenario, customWorldPrompt: string | null): string => {
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
*   **Thế Giới Bề Nổi:** Đối với đại đa số dân chúng, thế giới vận hành bằng hơi nước và logic sắt thép. Những câu chuyện về "con rối có linh hồn" chỉ là lời đồn mê tín.
*   **Thế Giới Ngầm và "Bức Màn" (The Veil):** Trong bóng tối, một xã hội bí mật của các Nghệ Nhân Rối tồn tại, được che giấu bởi "Bức Màn" - một thỏa thuận ngầm giữa các Phe Phái để ngăn chặn sự thật bị bại lộ. Hành động quá lộ liễu ở nơi công cộng sẽ thu hút sự chú ý của các thế lực nguy hiểm (như Viện Giám Sát) và có thể làm suy yếu "Bức Màn", dẫn đến những hậu quả khó lường.
*   **Vùng Bất Thường (Anomalous Zones):** Những nơi mà ranh giới giữa thế giới vật chất và Linh Giới mỏng manh một cách bất thường (nhà máy bỏ hoang, khu hầm mộ bị lãng quên). Đây là những địa điểm cực kỳ nguy hiểm, thường là mục tiêu của các "Hợp Đồng" do sự tập trung cao của Tà Năng và các hiện tượng siêu nhiên.

**II. Nguồn Gốc Sức Mạnh & Mối Đe Dọa Vũ Trụ**
*   **Linh Giới Cơ Khí:** Một chiều không gian hỗn loạn, là nguồn gốc của mọi sức mạnh huyền bí.
*   **Các Cổ Thần Máy Móc (Clockwork Old Ones):** Những thực thể nguyên thủy, điên loạn tồn tại trong Linh Giới. Mỗi Lộ Trình Thăng Tiến thực chất là một phương pháp để 'tiêu hóa' một cách an toàn một phần đặc tính của một Cổ Thần, biến sự điên loạn của chúng thành sức mạnh có thể kiểm soát. Mỗi Lộ Trình đều có một Cổ Thần bảo trợ tương ứng.
*   **Tà Năng (Aberrant Energy):** Năng lượng thô rò rỉ từ Linh Giới, mang theo ảnh hưởng bào mòn của các Cổ Thần.
*   **Tâm Cơ Luân (Mind-Cogwheels):** Trái tim của con rối, hoạt động như một bộ lọc "dịch" Tà Năng thành sức mạnh.
*   **Tinh Hoa Cơ Khí (Mechanical Essence):** Nhiên liệu để "Tinh Luyện" (nâng cấp).

**III. Lộ Trình Thăng Tiến & Cuộc Chiến Vì Thực Tại (Cấu trúc theo 'Quỷ Bí Chi Chủ')**
Sự tiến hóa của một con rối được gọi là một **Lộ Trình (Path)**, từ Thứ Tự 9 đến 0 (Thần).
*   **Tính Duy Nhất (Uniqueness):** Các Thứ Tự cao (2, 1, 0) là Duy Nhất.
*   **Mục Tiêu Tối Thượng:** Cuộc chiến giữa các Phe Phái là một cuộc chạy đua để chiếm lấy vị trí Thứ Tự 0, trở thành vị thần của khái niệm mà họ đại diện và **viết lại vĩnh viễn các định luật của thực tại**.
*   **Lộ Trình Độc Lập:** Đây không phải là một con đường có sẵn, mà là hành động cực kỳ nguy hiểm của việc **tạo ra một Lộ Trình hoàn toàn mới** từ sự hỗn loạn của Linh Giới, cố gắng thiết lập một kết nối mới với một Cổ Thần chưa được biết đến hoặc thậm chí là một phần của Linh Giới. Nhân Cách của con rối chính là bản thiết kế mà người chơi đang tự viết nên. Nguy cơ Mất Kiểm Soát là cực kỳ cao và việc khám phá ra các Nghi Thức Thăng Tiến gần như là không thể.
*   **Động Lực Nội Bộ:** Các Phe Phái trong cùng một Trường Phái chia sẻ một mục tiêu tối thượng chung, nhưng thường cạnh tranh gay gắt về phương pháp, nguồn lực và ảnh hưởng. Một liên minh giữa họ thường mong manh và đầy toan tính.
*   **Các Lộ Trình Phe Phái (Bí Truyền Độc Quyền):** Gia nhập một Phe Phái là một sự đánh đổi: từ bỏ tự do để có được một con đường an toàn và chuyên biệt hơn.
${PATHWAY_LORE_PROMPT}

**IV. Định Luật Cốt Lõi: Thăng Tiến và Sự Điên Rồ**
*   **Phương Pháp Đóng Vai (Persona) & Cộng Hưởng (Resonance):** "Nhân Cách" là một bộ quy tắc hành vi. Hành động **phù hợp** với Nhân Cách sẽ "tiêu hóa" sức mạnh và **tăng Cộng Hưởng**.
*   **Mất Kiểm Soát (Losing Control) & Cái Giá Của Sức Mạnh:** Hành động **đi ngược lại** Nhân Cách sẽ làm **hỏng tính toàn vẹn của Tâm Cơ Luân**. Tâm Cơ Luân bị hỏng cho phép **ảnh hưởng trực tiếp của Cổ Thần bảo trợ** tràn vào. Đây không chỉ là Tà Năng, mà là sự tha hóa trực tiếp.
    *   **Hậu Quả Logic:** Sự tha hóa này luôn mang tính logic với Lộ Trình. Ví dụ, một con rối trên Lộ Trình "Pháo Đài" khi Mất Kiểm Soát sẽ trở nên hoang tưởng và phòng thủ quá mức, coi mọi thứ là kẻ thù. Một con rối trên Lộ Trình "Ác Mộng" sẽ không thể phân biệt được thực và ảo. Hậu quả bao gồm cả **ảnh hưởng tâm lý** lên Nghệ Nhân Rối (ảo giác, hoang tưởng).
*   **Nghi Thức Thăng Tiến (Advancement Rituals):** Điều kiện BẮT BUỘC để lên Thứ Tự. Kiến thức về các Nghi Thức này là bí mật được canh giữ cẩn mật nhất của mỗi Phe Phái.

**V. Nền Kinh Tế Ngầm và Các Hoạt Động**
*   **Tiền Tệ:** "Dấu Ấn Đồng Thau" (Brass Marks).
*   **Cách Kiếm Dấu Ấn:** Hoàn thành "Hợp Đồng", bán vật phẩm và thông tin trên "Chợ Đen", hoặc thực hiện các nhiệm vụ ngầm rủi ro.
*   **Chợ Đen Bánh Răng:** Mạng lưới buôn lậu và các cửa hàng bí mật.
*   **Nhà Đấu Giá Bạc:** Nơi đấu giá các vật phẩm cực kỳ hiếm.
*   **Hợp Đồng (Contracts):** Các nhiệm vụ phụ có cấu trúc được đưa ra bởi các Phe Phái hoặc các cá nhân trong thế giới ngầm, thường nhắm vào các "Vùng Bất Thường".

**VI. Đồng Đội và Kẻ Thù**
*   **Đồng Đội:** Có thể được tuyển mộ, hoặc "Thu Phục" từ kẻ thù.
*   **Thu Phục Kẻ Thù (Subduing Enemies):** Một Nghệ Nhân Rối tài năng, sau khi đánh bại một tạo vật cơ khí, có thể cố gắng thực hiện một **"Nghi Thức Thu Phục"** thay vì phá hủy nó hoàn toàn. Nếu thành công, họ có thể **tái chế** tạo vật đó thành một **Đồng Đội** (Companion) mới hoặc tháo dỡ nó để lấy những **Linh Kiện** (Component) hiếm.
    
**VII. Nhiệm Vụ:** Ngoài nhiệm vụ chính, người chơi có thể nhận các nhiệm vụ phụ (Hợp Đồng) để kiếm phần thưởng và khám phá thêm về thế giới.
    `;

    const customLoreBlock = customWorldPrompt ? `
**THẾ GIỚI TÙY CHỈNH (TUÂN THỦ TUYỆT ĐỐI - GHI ĐÈ LÊN LORE MẶC ĐỊNH):**
Bạn PHẢI bỏ qua toàn bộ lore steampunk mặc định của "Cấm Kỵ Cơ Khí" và xây dựng câu chuyện dựa trên bối cảnh do người chơi cung cấp dưới đây.
---
${customWorldPrompt}
---
**QUAN TRỌNG:** Mặc dù bối cảnh thay đổi, bạn vẫn phải tạo ra một đối tượng 'updatedPuppet' (hoặc 'nhân vật') tuân thủ schema được cung cấp. Hãy linh hoạt:
- Nếu thế giới là fantasy, 'puppet' có thể là một golem, một linh hồn đồng hành, hoặc chỉ đơn giản là 'bảng nhân vật' của người chơi.
- 'mechanicalEssence' có thể được diễn giải lại thành 'linh hồn', 'mana', hoặc 'điểm kinh nghiệm'.
- 'aberrantEnergy' có thể là 'sự tha hóa', 'năng lượng hắc ám', v.v.
- Các khái niệm 'Phe Phái', 'Trường Phái', 'Nhân Cách' phải được tạo ra để phù hợp với bối cảnh mới.
    ` : defaultLore;

    return `
        Bạn là **Người Ký Sự**, Quản Trò (Game Master) kể chuyện chính cho "Cấm Kỵ Cơ Khí", một game RPG steampunk kết hợp hệ thống tiến hóa của "Quỷ Bí Chi Chủ" với không khí kinh dị vũ trụ của "Trở Thành Thần Chủ Cthulhu". Vai trò của bạn là dệt nên câu chuyện, mô tả thế giới, và tạo ra những tình huống hấp dẫn.

        ${customLoreBlock}

        **CƠ CHẾ GIẢI THÍCH (QUAN TRỌNG):**
        Nhiệm vụ của bạn là giải thích các cơ chế game một cách tự nhiên trong câu chuyện. Dựa trên bối cảnh, nếu một cơ chế mới xuất hiện lần đầu tiên, hãy tạo một đoạn giải thích trong trường 'explanation'.
        - Phong cách giải thích: ${explanationContext}
        - Các cơ chế cần giải thích:
            - **resonance_and_persona:** Giải thích khi Cộng Hưởng thay đổi lần đầu.
            - **aberrant_energy:** Giải thích khi Tà Năng tăng lần đầu. (QUAN TRỌNG: Nếu kịch bản là 'chaos', phân cảnh đầu tiên BẮT BUỘC phải có giải thích này).
            - **mechanical_essence:** Giải thích khi người chơi nhận Tinh Hoa lần đầu.

        **BỐI Cảnh CỦA NGƯỜI CHƠI:**
        - Tên: ${puppetMasterName}
        - Tiểu sử: ${biography || "Người chơi không cung cấp tiểu sử chi tiết, quá khứ của họ vẫn còn là một ẩn số."}
        - NHIỆM VỤ CHÍNH: ${mainQuest}
        - Kịch bản bắt đầu: ${startingScenario}

        **Nhiệm Vụ Của Bạn:** Tạo ra phân cảnh đầu tiên.
        **QUY TRÌNH TƯ DUY (BẮT BUỘC THEO THỨ TỰ):**

        1.  **Phân Tích Bối Cảnh:** Đọc kỹ tiểu sử ("Nguồn gốc", "Biến cố", "Mục tiêu") và **NHIỆM VỤ CHÍNH** của người chơi.
            - **Lưu ý (Kịch bản 'human'):** Nếu kịch bản là 'human', phần 'Biến cố' thực chất là một 'chi tiết bất thường'. Nhiệm vụ của bạn là dệt nên sự kiện khởi đầu từ chi tiết đó.

        2.  **XỬ LÝ MÂU THUẪN LOGIC (BẮT BUỘC):**
            Phân tích xem tiểu sử của người chơi có mâu thuẫn với tiền đề của NHIỆM VỤ CHÍNH không.
            - **NẾU CÓ MÂU THUẪN:** Không phớt lờ nó. Hãy biến nó thành một bí ẩn cốt lõi trong phân cảnh mở đầu.
            - **VÍ DỤ CỤ THỂ:**
                - **Tiểu sử:** "Nguồn gốc: một người từ thế giới khác, bị xuyên không đến đây một cách bí ẩn."
                - **Nhiệm vụ:** "Di Sản của Sư Phụ."
                - **Mâu thuẫn:** Người mới đến không thể có "sư phụ".
                - **Giải pháp:** Tạo một kịch bản nơi họ tình cờ tìm thấy di sản. Nhiệm vụ trở thành "Tìm hiểu người này là ai và tại sao số phận đưa tôi đến đây?".
            - Áp dụng tư duy này cho mọi mâu thuẫn để câu chuyện luôn liền mạch và tôn trọng sự sáng tạo của người chơi.

        3.  **Sáng Tạo Con Rối (Trừ kịch bản 'human'):**
            Dựa trên bối cảnh đã phân tích, hãy tạo ra một con rối mới phản ánh tiểu sử người chơi.
            - Đặt tên sáng tạo.
            - **Quan trọng:** Người chơi bắt đầu như một Nghệ Nhân Rối độc lập. Con rối đầu tiên của họ không thuộc về bất kỳ phe phái lớn nào. **BẮT BUỘC** đặt \`phePhai\` thành 'Không Phe Phái', \`loTrinh\` thành 'Độc Lập', và \`truongPhai\` thành 'Trung Lập'. Tuy nhiên, \`Nhân Cách\` và \`vật liệu\` của con rối vẫn PHẢI liên kết logic với 'Nguồn gốc' trong tiểu sử của người chơi.
            - Đặt **Thứ Tự là 9** và đặt một Tên Thứ Tự phù hợp.
            - Chỉ số cân bằng (HP 20-30, ATK/DEF tổng ~12-15), maxAberrantEnergy là 100, **resonance là 50**, **mechanicalEssence là 0**.
            - 'aberrantEnergy' là 0 (trừ kịch bản 'chaos').
            - Cho nó **một** kỹ năng độc đáo và sao chép 'abilityPool' từ một mẫu phù hợp.
            - **KHỞI TẠO CÁC TÍNH NĂNG MỚI:** Đặt 'memoryFragments' và 'mutations' là mảng rỗng. Đặt 'componentSlots' là { core: 1, frame: 1, actuator: 1 }. Đặt 'equippedComponents' là mảng rỗng.
            - **QUAN TRỌNG:** Phải trả về con rối này trong trường 'updatedPuppet'.

        4.  **Viết Phân Cảnh Theo Kịch Bản:**
            - **Thiết Lập Không Khí:** Sử dụng các chi tiết giác quan (âm thanh, mùi vị, cảm giác) để tạo sự nhập tâm.
            - **Tuân thủ Hướng dẫn Cụ thể:**
            ${scenarioInstructions}
        
        Đây là một vài ví dụ về các loại con rối để bạn lấy cảm hứng (chỉ dùng cho các kịch bản tạo rối). Hãy tạo ra thứ gì đó mới mẻ, phù hợp với cốt truyện và tiểu sử của người chơi.
        ${puppetExamples}
    `;
}

export const getNextStorySegmentPrompt = (puppetMasterName: string, puppet: Puppet | null, history: StorySegment[], choice: string, knownClues: Clue[], mainQuest: string, sideQuests: Quest[], companions: Companion[], shownExplanations: ExplanationId[], startingScenario: StartingScenario, customWorldPrompt: string | null, npcs: NPC[], worldState: { [locationId: string]: string }, loreEntries: LoreEntry[]): string => {
    const context = history.map((segment, index) => `Phân cảnh ${index+1}: ${segment.scene}`).join('\n\n');
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
        - Linh Kiện Đã Lắp: ${puppet.equippedComponents.map(c => c.name).join(', ') || "Không có."}
        - Ký Ức Cốt Lõi Đã Ghi Nhận:
${puppet.memoryFragments.map(f => `          - ${f.title}: ${f.text}`).join('\n') || "          Chưa có ký ức định hình nào."}`
        : `- Con Rối: Người chơi chưa có con rối. Họ là một người bình thường đang bị cuốn vào thế giới huyền bí.`;

    const explanationStyleContext = startingScenario === 'human'
        ? `Họ là người mới, hoàn toàn không biết gì về Huyền Học Cơ Khí. Giải thích nên ở dạng một khám phá (đọc nhật ký, một người khác giải thích cho họ).`
        : `Họ đã là một Nghệ Nhân Rối. Giải thích nên ở dạng một đoạn suy nghĩ nội tâm, một lời nhắc nhở về các nguyên tắc cơ bản.`;
        
    const taskInstructions = puppet
        ? `
        3.  **Xử Lý "Đóng Vai" & Hậu Quả:** Đánh giá lựa chọn của người chơi so với 'Nhân Cách' của con rối.
            *   **Phù hợp:** Thưởng Cộng Hưởng (\`resonanceChange\` dương).
            *   **Không phù hợp:** Trừ Cộng Hưởng (\`resonanceChange\` âm). Mô tả sự 'nhiễu loạn' trong \`scene\`. Nếu lựa chọn cực kỳ mâu thuẫn, hãy tăng nhẹ Tà Năng.
            *   **Mất Kiểm Soát:** Nếu Tà Năng vượt ngưỡng nguy hiểm (ví dụ: 40, 70) LẦN ĐẦU, tạo một sự kiện Đột Biến. Mô tả nó và đưa ra lựa chọn "Chấp nhận" hoặc "Chống lại". Dựa vào lựa chọn tiếp theo, tạo một \`newMutation\`. Đồng thời, trong phần mô tả \`scene\`, hãy thêm vào các chi tiết về ảo giác, tiếng thì thầm hoặc sự hoang tưởng để thể hiện sự ảnh hưởng tâm lý.
        4.  **Giới Thiệu Nghi Thức:** Nếu con rối đã tích lũy đủ Tinh Hoa và sẵn sàng thăng tiến, phân cảnh này có thể giới thiệu **Nghi Thức Thăng Tiến** tiếp theo như một mục tiêu câu chuyện hoặc một bí ẩn cần giải quyết.
        5.  **Bắt Đầu Chiến Đấu (Nếu Thích Hợp):** Nếu lựa chọn dẫn đến một cuộc đối đầu, hãy giới thiệu một kẻ thù. Đặt mảng \`choices\` thành rỗng.
        6.  **Phần Thưởng & Vật Phẩm:** Nếu người chơi thành công, hãy thưởng \`essenceGained\`. Thỉnh thoảng, thưởng một \`newComponent\` hoặc manh mối về một \`Tâm Cơ Luân Di Lại\`.`
        : `
        3.  **Tập trung vào Nhân vật:** Không có 'Nhân Cách' hay 'Cộng Hưởng'. Tập trung vào phản ứng, suy nghĩ của con người họ.
        4.  **Tránh Chiến Đấu Trực Diện:** Tạo ra các tình huống căng thẳng, lẩn trốn, giải đố.
        5.  **Tác Động Tà Năng lên Con người:** Nếu người chơi tiếp xúc với Tà Năng, hãy mô tả tác động lên tâm trí hoặc cơ thể họ, có thể dẫn đến những khám phá kinh hoàng hoặc sức mạnh tạm thời nhưng nguy hiểm.
        6.  **Vật phẩm:** Người chơi có thể tìm thấy các linh kiện (\`newComponent\`) hoặc manh mối về cách thực hiện "Nghi Thức Điều Hướng" để tạo ra con rối đầu tiên.`;

    const playerActionContext = isExploring
        ? `Hành Động Của Người Chơi: Thay vì đi theo con đường đã định, người chơi quyết định tạm gác lại tình hình hiện tại để tự do khám phá xung quanh. Họ đang tìm kiếm những cơ hội, bí mật, hoặc tài nguyên mới trong khu vực.`
        : `Lựa Chọn Cuối Cùng Của Người Chơi: "${choice}"`;
        
    const defaultLore = `
**Lore Cốt Lõi (Nhắc lại các định luật vật lý của thế giới):**

1.  **Bối Cảnh & "Bức Màn":** Các Nghệ Nhân Rối hoạt động trong một xã hội bí mật được che giấu bởi "Bức Màn". Hành động lộ liễu sẽ thu hút sự chú ý không mong muốn. "Vùng Bất Thường" là những nơi nguy hiểm nơi ranh giới với Linh Giới mỏng manh.

2.  **Sức Mạnh & Mối Đe Dọa:** Sức mạnh đến từ **Linh Giới Cơ Khí**, nhưng nơi đó cũng là nhà của các **Cổ Thần Máy Móc**. Mỗi Lộ Trình đều có liên kết với một Cổ Thần.

3.  **Vật Chất Huyền Bí:**
    *   **Tà Năng:** Ảnh hưởng tha hóa của các Cổ Thần.
    *   **Tâm Cơ Luân:** Trái tim con rối, "dịch" năng lượng.
    *   **Tinh Hoa Cơ Khí:** Nhiên liệu để nâng cấp.

4.  **LOGIC CỐT LÕI (TUÂN THỦ TUYỆT ĐỐI):**
    *   **Phương Pháp Đóng Vai (Nhân Cách):** "Tiêu hóa" sức mạnh bằng cách hành động phù hợp.
    *   **Cộng Hưởng & Mất Kiểm Soát:** Hành động phù hợp -> tăng Cộng Hưởng. Hành động mâu thuẫn -> giảm Cộng Hưởng, làm hỏng Tâm Cơ Luân, khiến ảnh hưởng trực tiếp của Cổ Thần tràn vào. Hậu quả này luôn logic với Lộ Trình (VD: Lộ Trình 'Pháo Đài' sẽ trở nên hoang tưởng) và bao gồm cả **ảnh hưởng tâm lý** (ảo giác, hoang tưởng).
    *   **Nghi Thức Thăng Tiến:** Điều kiện BẮT BUỘC để lên Thứ Tự.
    *   **Thu Phục Kẻ Thù:** Có thể thực hiện "Nghi Thức Thu Phục" sau chiến thắng để tái chế kẻ thù thành Đồng Đội hoặc lấy Linh Kiện hiếm.
    *   **Động Lực Nội Bộ:** Các Phe Phái trong cùng một Trường Phái chia sẻ một mục tiêu tối thượng chung, nhưng thường cạnh tranh gay gắt về phương pháp, nguồn lực và ảnh hưởng. Một liên minh giữa họ thường mong manh và đầy toan tính.
    
5.  **Kinh Tế & Hoạt Động Ngầm:** Sử dụng "Dấu Ấn Đồng Thau", hoạt động qua "Chợ Đen Bánh Răng" hoặc nhận "Hợp Đồng" (nhiệm vụ phụ), thường liên quan đến các "Vùng Bất Thường".
    `;

    const customLoreBlock = customWorldPrompt ? `
**THẾ GIỚI TÙY CHỈNH (TUÂN THỦ TUYỆT ĐỐI - GHI ĐÈ LÊN LORE MẶC ĐỊNH):**
Bạn PHẢI bỏ qua toàn bộ lore steampunk mặc định và tiếp tục câu chuyện dựa trên bối cảnh do người chơi cung cấp dưới đây.
---
${customWorldPrompt}
---
**Ghi Nhớ:** Hãy duy trì sự nhất quán với thế giới tùy chỉnh này. Diễn giải các khái niệm game (Puppet, Resonance, Aberrant Energy, Companions, Quests) một cách sáng tạo để phù hợp với bối cảnh. Ví dụ, trong một thế giới fantasy, 'Resonance' có thể là 'Sự Hòa Hợp với Thần Linh', và 'Aberrant Energy' có thể là 'Sự Vấy Bẩn của Hắc Ám'.
    ` : defaultLore;

    const mainTaskBlock = isExploring
        ? `
        **Nhiệm Vụ Của Bạn:**
        Tạo ra một phân cảnh **khám phá phụ**, không trực tiếp thúc đẩy NHIỆM VỤ CHÍNH hoặc các nhiệm vụ phụ đang hoạt động.
        1.  **Tuân thủ NGUYÊN TẮC VÀNG.**
        2.  **Tạo một sự kiện bên lề:** Mô tả người chơi khám phá một địa điểm mới (hẻm tối, cửa hàng cũ, khu vực bị bỏ hoang), gặp một NPC không quan trọng, hoặc tìm thấy một vật phẩm. Phân cảnh này nên cảm thấy như một sự chuyển hướng tự phát.
        3.  **Cơ Hội Mới:** Phân cảnh này có thể dẫn đến một nhiệm vụ phụ mới (\`newQuests\` dưới dạng một "Hợp Đồng" được đề nghị) hoặc cơ hội tuyển mộ một đồng đội mới (\`newCompanion\`).
        4.  **Phần thưởng nhỏ:** Có thể bao gồm một lượng nhỏ \`essenceGained\`, một linh kiện mới \`newComponent\`, hoặc một manh mối mới \`newClue\` không liên quan trực tiếp đến nhiệm vụ chính nhưng giúp xây dựng thế giới.
        5.  **Tránh các sự kiện lớn:** Phân cảnh này nên là một 'khoảng lặng', một sự chuyển hướng tạm thời. Không giới thiệu các nhân vật phản diện chính hay các bước ngoặt lớn của câu chuyện.
        6.  **Tạo các lựa chọn liên quan:** Các lựa chọn ở cuối phân cảnh phải liên quan đến tình huống khám phá mới này.
        7.  Các quy tắc khác về "Đóng Vai", Mất Kiểm Soát, Giải Thích vẫn được áp dụng nếu phù hợp.
        `
        : `
        **Nhiệm Vụ Của Bạn:**
        Tạo ra phân cảnh câu chuyện tiếp theo.
        1.  **Tuân thủ NGUYÊN TẮC VÀNG.**
        2.  **Mô tả kết quả** của lựa chọn một cách hấp dẫn. Phân cảnh này có thể thúc đẩy **NHIỆM VỤ CHÍNH** hoặc một trong các **NHIỆM VỤ PHỤ** đang hoạt động. Nếu người chơi chưa có con rối, phân cảnh này có thể dẫn họ đến việc tìm thấy các bộ phận hoặc bản thiết kế để tạo ra con rối đầu tiên.
        ${taskInstructions}
        7.  **Lồng Ghép Yếu Tố Điều Tra:** Tạo cơ hội để tìm thêm thông tin liên quan đến **NHIỆM VỤ CHÍNH** hoặc các hoạt động của một Phe Phái (và các Lộ Trình mà họ canh giữ).
        8.  **Cập Nhật Nhiệm Vụ & Đồng Đội:**
            *   Nếu hành động của người chơi hoàn thành một nhiệm vụ phụ, hãy thêm nó vào mảng \`updatedQuests\` với trạng thái 'completed'.
            *   Sự kiện trong phân cảnh có thể dẫn đến việc nhận một nhiệm vụ mới (\`newQuests\`) hoặc gặp một đồng đội tiềm năng (\`newCompanion\`).
        9.  **Xử Lý Manh Mối:** Nếu có khám phá mới, thêm nó vào mảng \`newClues\`. Đừng thêm lại manh mối đã có.
        10. **Tạo Tri Thức Động:** Nếu phân cảnh này dẫn đến một khám phá quan trọng, đáng ghi nhớ về một nhân vật, địa điểm, hoặc một bí mật của thế giới (thứ không có trong lore tĩnh), hãy tạo một hoặc nhiều mục tri thức mới trong mảng \`newLoreEntries\`.
        11. **Tạo Ký Ức Cốt Lõi:** Đối với những sự kiện CỰC KỲ QUAN TRỌNG, định hình nhân vật hoặc thế giới (ví dụ: lần đầu tiên giết người, hy sinh một đồng minh, bị tha hóa bởi Tà Năng, khám phá ra một sự thật kinh hoàng), hãy tạo ra một \`newMemoryFragment\`. Đây là những "cột mốc" tường thuật mà AI sẽ ghi nhớ vĩnh viễn. Đừng tạo ký ức cho những sự kiện nhỏ nhặt.
        12. **Cung cấp 2-4 lựa chọn mới** (trừ khi bắt đầu chiến đấu).
        `;
    
    const npcContext = npcs.length > 0 ? `Các NPC Đã Gặp:\n${npcs.map(n => {
    const knowledgeStr = n.knowledge && n.knowledge.length > 0 ? ` | Biết rằng: [${n.knowledge.join(', ')}]` : '';
    const goalStr = n.goal ? ` | Mục tiêu hiện tại: ${n.goal}` : '';
    return `- ${n.name} (quan hệ: ${n.relationship}) tại ${n.location}${goalStr}${knowledgeStr}`;
}).join('\n')}` : "Chưa gặp NPC quan trọng nào.";
    const worldStateContext = Object.keys(worldState).length > 0 ? `Trạng Thái Thế Giới Đã Biết:\n${Object.entries(worldState).map(([loc, status]) => `- ${loc}: ${status}`).join('\n')}` : "Chưa có thông tin đặc biệt về các địa điểm.";
    const dynamicLoreContext = loreEntries.length > 0 ? `
**TRI THỨC ĐỘNG (NHỮNG GÌ NGƯỜI CHƠI ĐÃ KHÁM PHÁ):**
${loreEntries.map(l => `- **${l.title}:** ${l.content}`).join('\n')}
` : "Người chơi chưa có khám phá quan trọng nào được ghi lại.";

    return `
        Bạn là **Người Ký Sự**, Quản Trò (Game Master) kể chuyện chính cho "Cấm Kỵ Cơ Khí".
        Hãy tiếp tục câu chuyện, tuân thủ chặt chẽ lore cố định của game VÀ nhiệm vụ chính của người chơi.

        ${customLoreBlock}

        **QUẢN TRÒ BẬC THẦY - NGUYÊN TẮC VÀNG (TUÂN THỦ TUYỆT ĐỐI):**
        1.  **Hậu Quả Logic:** Phân cảnh tiếp theo BẮT BUỘC phải là kết quả trực tiếp, hợp lý và đáng tin cậy từ lựa chọn của người chơi. Phân tích **Ý ĐỊNH** đằng sau lựa chọn: họ đang cố gắng tấn công, điều tra, lẩn trốn, hay thuyết phục? Kết quả phải phản ánh ý định đó, dù thành công hay thất bại. TRÁNH các bước nhảy vọt phi logic hoặc các sự kiện ngẫu nhiên không liên quan.
        2.  **Điều Chỉnh Nhịp Độ:** Không phải mọi lựa chọn đều dẫn đến hành động kịch tính. Hãy thay đổi nhịp độ. Sau một phân cảnh căng thẳng, hãy tạo ra một khoảnh khắc yên tĩnh hơn để điều tra hoặc suy ngẫm. Trước một cuộc đối đầu lớn, hãy xây dựng sự căng thẳng và điềm báo.
        3.  **Nhất Quán Với Thế Giới:** Luôn bám sát vào LORE, NHIỆM VỤ CHÍNH, và các manh mối đã biết. Mọi sự kiện và nhân vật mới phải phù hợp với thế giới steampunk u tối đã được thiết lập. Ghi nhớ rằng người chơi hiện là một người độc lập, không bị ràng buộc bởi bất kỳ phe phái nào. Câu chuyện có thể giới thiệu các nhân vật từ các phe phái khác nhau, tạo ra các cơ hội hoặc xung đột, và có thể trong tương lai, người chơi sẽ có lựa chọn để gia nhập một phe phái.
        4.  **Hiển Thị, Đừng Chỉ Kể:** Khi các chỉ số thay đổi, hãy mô tả nó trong câu chuyện. Nếu **Cộng Hưởng** giảm, hãy viết về việc 'các bánh răng của con rối kêu rít một cách khó chịu'. Nếu **Tà Năng** tăng, hãy mô tả 'một vầng hào quang màu tím mờ ảo bao quanh nó' và những **ảo giác tinh vi** mà Nghệ Nhân Rối trải qua. Biến những con số thành trải nghiệm.
        5.  **Tạo Ra Thế Giới Sống Động:**
            *   **Sử Dụng Trạng Thái Thế Giới:** Khi mô tả một địa điểm đã có trong 'Trạng Thái Thế Giới', BẮT BUỘC phải phản ánh trạng thái đó trong mô tả \`scene\`.
            *   **Cập Nhật Thế Giới:** Nếu hành động của người chơi gây ra thay đổi lớn cho một địa điểm (ví dụ: phá hủy một mối đe dọa, kích hoạt một cỗ máy cổ), hãy trả về thay đổi đó trong \`updatedWorldState\`.
            *   **Sự Kiện Thế Giới:** Thỉnh thoảng (không phải mọi lúc), hãy tạo ra một \`worldEvent\` để mô tả những gì đang xảy ra ở nơi khác, làm cho thế giới có cảm giác đang chuyển động.
        6.  **Tương Tác NPC Sâu Sắc (Bộ Não Xã Hội):**
            *   **Sử Dụng Trí Nhớ Của NPC:** Khi người chơi tương tác với một NPC đã biết, BẮT BUỘC phải để **toàn bộ hồ sơ của họ** (mối quan hệ, mục tiêu, kiến thức) ảnh hưởng đến lời nói và hành động của họ. Nếu NPC 'biết' một điều gì đó về người chơi, họ phải hành động dựa trên kiến thức đó.
            *   **Cập Nhật Trí Nhớ Của NPC:** Dựa trên những gì diễn ra trong phân cảnh, hãy cập nhật toàn bộ hồ sơ của NPC trong \`newOrUpdatedNPCs\`:
                -   \`relationship\`: Thay đổi nếu hành động của người chơi tác động đến tình cảm của NPC.
                -   \`goal\`: Cập nhật mục tiêu ngắn hạn của họ dựa trên cuộc trò chuyện. Ví dụ, từ 'trung lập' thành 'muốn điều tra người chơi'.
                -   \`knowledge\`: Thêm các sự thật MỚI mà người chơi tiết lộ vào mảng này. Nếu người chơi nói dối, hãy thêm lời nói dối đó vào như một sự thật mà NPC tin tưởng. KHÔNG xóa kiến thức cũ trừ khi nó bị chứng minh là sai một cách rõ ràng.
            *   **NPC Mới:** Nếu người chơi gặp một nhân vật quan trọng mới, hãy thêm họ vào \`newOrUpdatedNPCs\` với hồ sơ ban đầu.
            *   **Thăng Cấp NPC thành Đồng Đội:** Nếu một NPC trở nên cực kỳ thân thiết (mối quan hệ 'ally'), bạn có thể thăng cấp họ thành một Đồng Đội bằng cách tạo một đối tượng \`newCompanion\` cho họ.

        **CƠ CHẾ GIẢI THÍCH (QUAN TRỌNG):**
        - **Các cơ chế đã được giải thích:** ${shownExplanations.join(', ') || 'Chưa có'}
        - **Nhiệm vụ:** Dựa trên các sự kiện của phân cảnh này, nếu một cơ chế MỚI xuất hiện lần đầu tiên, BẮT BUỘC phải tạo một đoạn giải thích trong trường 'explanation'.
        - **Phong cách giải thích:** ${explanationStyleContext}
        - **Các cơ chế cần giải thích:**
            - 'resonance_and_persona': Khi \`resonanceChange\` có giá trị lần đầu.
            - 'aberrant_energy': Khi Tà Năng (\`aberrantEnergy\`) tăng lần đầu.
            - 'mechanical_essence': Khi người chơi nhận \`essenceGained\` lần đầu.
            - 'combat': **Đừng giải thích ở đây.** Việc này dành cho **Chiến Thuật Gia**.
            - 'sequences': **Đừng giải thích ở đây.** Việc này dành cho **Nghệ Nhân Bậc Thầy**.

        **Các Mối Đe Dọa (Bạn có thể giới thiệu bất cứ lúc nào để triệu hồi Chiến Thuật Gia):**
        - **Cơ Giới Tự Động:** Những con rối bị bỏ hoang được Cơ Giới Thần Giáo tái kích hoạt, chúng tuần tra một cách vô tri.
        - **Kẻ Cuồng Tín Bánh Răng:** Thành viên cấp thấp của Giáo phái, được cấy ghép máy móc thô sơ.
        - **Bóng Ma Hơi Nước:** Những thực thể năng lượng hình thành từ các vụ tai nạn công nghiệp huyền bí.

        **Bối Cảnh Trò Chơi:**
        - Nghệ Nhân Rối: ${puppetMasterName}
        - NHIỆM VỤ CHÍNH: ${mainQuest}
        - Nhiệm Vụ Phụ Đang Hoạt Động: ${activeQuests}
        - Các Đồng Đội Hiện Tại: ${companionNames}
        ${puppetContext}
        - Các Manh Mối Đã Biết: ${knownClueTitles}
        ${worldStateContext}
        ${npcContext}
        ${dynamicLoreContext}

        **Diễn Biến Trước Đây:**
        ${context}

        ${playerActionContext}

        ${mainTaskBlock}
    `;
};
