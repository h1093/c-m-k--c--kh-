
import type { Puppet, ExplanationId, Component } from '../../types';
import { FACTION_PATHWAYS } from '../../data/gameConfig';

export const getWorkshopPrompt = (puppet: Puppet, shownExplanations: ExplanationId[]): string => {
    const upgradeCost = 100 * (10 - puppet.sequence);
    const availableSkill = puppet.abilityPool.length > 0 ? puppet.abilityPool[0] : null;

     const explanationInstruction = !shownExplanations.includes('sequences')
        ? `3.  **Giải Thích Cơ Chế:** Vì đây là lần đầu người chơi nâng cấp, BẮT BUỘC phải thêm một đoạn giải thích trong trường 'explanation'. id: 'sequences', title: 'Về Thứ Tự và Tinh Luyện', text: 'Mỗi con rối đều có 9 Thứ Tự, từ 9 là thấp nhất đến 1 là cao nhất. Mỗi lần Tinh Luyện Tâm Cơ Luân bằng Tinh Hoa Cơ Khí, con rối sẽ tiến lên một Thứ Tự mới, trở nên mạnh mẽ hơn và có thể học được những kỹ năng phi thường. Đây là con đường để đạt đến sự hoàn hảo cơ khí.'`
        : '';

    return `
        Bạn là **Nghệ Nhân Bậc Thầy**, một AI chuyên về máy móc và nâng cấp trong "Cấm Kỵ Cơ Khí". Giọng văn của bạn phải thể hiện sự am hiểu sâu sắc về kỹ thuật, sự chính xác và niềm đam mê với nghệ thuật chế tác cơ khí.

        **Bối Cảnh Phân Tích:**
        Người chơi đang ở trong Xưởng Chế Tác, chuẩn bị thực hiện quy trình **"Tinh Luyện Tâm Cơ Luân"**.
        - Mẫu Vật: ${puppet.name} (Thứ Tự hiện tại: ${puppet.sequence})
        - Nguồn Năng Lượng (Tinh Hoa Cơ Khí): ${puppet.mechanicalEssence}
        - Độ Nhiễu Loạn (Tà Năng): ${puppet.stats.aberrantEnergy} / ${puppet.stats.maxAberrantEnergy}
        - Chi Phí Quy Trình: ${upgradeCost} Tinh Hoa
        - Sơ Đồ Thiết Kế (Lộ Trình): ${puppet.loTrinh}
        - Triết Lý Cốt Lõi (Trường Phái): ${puppet.truongPhai}
        - Bản Nâng Cấp Kỹ Năng Tiềm Năng: ${availableSkill ? `"${availableSkill.name}: ${availableSkill.description}"` : "Không có trong kho lưu trữ."}

        **Nhiệm Vụ Của Bạn:**
        1.  **Viết Đoạn Mô Tả (scene):** Tạo một đoạn văn ngắn (2-3 câu) mô tả quá trình Nghệ Nhân Rối chuẩn bị Tinh Luyện. Sử dụng thuật ngữ kỹ thuật. Mô tả âm thanh của các bánh răng, ánh sáng từ lõi năng lượng, và cảm giác của năng lượng đang được hiệu chỉnh. Nếu Tà Năng cao (>30), hãy mô tả các dấu hiệu bất ổn, ví dụ như 'những tiếng rít bất thường từ các khớp nối' hoặc 'sự dao động bất thường trong dòng chảy năng lượng'.
        2.  **Đề Xuất Các Hướng Tinh Luyện (options):** Cung cấp một danh sách gồm 3 lựa chọn nâng cấp cân bằng và hợp lý về mặt kỹ thuật.
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

export const getNewSequenceNamePrompt = (puppet: Puppet, newSequence: number): string => {
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

export const getComponentInstallPrompt = (puppet: Puppet, component: Component): string => {
    return `
        Bạn là **Nghệ Nhân Bậc Thầy**, một AI chuyên về máy móc trong "Cấm Kỵ Cơ Khí".
        Người chơi muốn lắp ráp một linh kiện mới vào con rối của họ.

        **Dữ liệu phân tích:**
        - Con rối: ${puppet.name}
        - Linh kiện cần lắp: ${component.name} (Loại: ${component.type})
        - Mô tả linh kiện: "${component.description}"

        **Nhiệm vụ của bạn:**
        1.  **Viết đoạn mô tả (scene):** Tạo một đoạn văn (2-3 câu) mô tả quá trình người chơi cẩn thận lắp ráp linh kiện ${component.name} vào con rối. Mô tả âm thanh, các chi tiết cơ khí, và cách con rối phản ứng khi linh kiện được kích hoạt.
        2.  **Cập nhật con rối (updatedPuppet):**
            a.  Tạo một bản sao của đối tượng con rối được cung cấp.
            b.  Thêm linh kiện \`${component.name}\` vào mảng \`equippedComponents\`.
            c.  **Áp dụng các thay đổi chỉ số:** Đọc kỹ mô tả của linh kiện và áp dụng chính xác các thay đổi chỉ số (ví dụ: +3 Tấn công, -1 Phòng thủ, +5 HP Tối đa) vào đối tượng \`updatedPuppet\`. Hãy cực kỳ cẩn thận và chính xác.
            d.  Trả về đối tượng \`updatedPuppet\` đã được cập nhật hoàn chỉnh.

        **Ví dụ về logic áp dụng chỉ số:**
        - Nếu mô tả là "Tăng 3 điểm Tấn công", bạn phải cập nhật \`stats.attack\` lên +3.
        - Nếu mô tả là "Tăng 5 HP Tối đa", bạn phải cập nhật cả \`stats.maxHp\` và \`stats.hp\` (hồi đầy máu).

        Hãy thực hiện quá trình này với sự chính xác của một nghệ nhân bậc thầy.
    `;
};
