import type { StorySegment } from '../../types';

export const getLoreSummaryPrompt = (recentSegments: StorySegment[]): string => {
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