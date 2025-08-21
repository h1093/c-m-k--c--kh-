
import type { StartingScenario } from '../../types';

export const getBiographyGenerationPrompt = (
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