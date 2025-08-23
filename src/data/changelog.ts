
export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "0.10.0",
    date: "Hiện tại",
    title: "Nền Tảng Tự Do & Thế Giới Sống",
    changes: [
      "**Hệ Thống Sáng Tạo Thế Giới:** Thêm tính năng **Tạo Thế Giới Mới** ngay từ màn hình chính, cho phép người chơi tự định nghĩa bối cảnh, cốt truyện và ý tưởng nhân vật.",
      "**Tùy Chỉnh Sâu Sắc:** Giới thiệu nhiều **kịch bản khởi đầu**, **độ khó** đa dạng, và khả năng **tự viết nhiệm vụ chính** để cá nhân hóa hoàn toàn cuộc phiêu lưu của bạn.",
      "**AI Hỗ Trợ Sáng Tạo:** Thêm nút **Tạo Tiểu Sử Ngẫu Nhiên** để AI giúp bạn xây dựng một câu chuyện nhân vật độc đáo.",
      "**Hệ Thống Gợi Ý Thông Minh:** Thêm nút **'Gợi ý'** trong màn hình phiêu lưu. Khi bế tắc, hãy để AI đưa ra một lời khuyên tinh tế dựa trên tình hình hiện tại.",
      "**NPC Có Chiều Sâu:** Mỗi NPC giờ đây có **lý lịch riêng** và **trí nhớ**, họ sẽ phản ứng một cách logic hơn với các hành động của bạn.",
      "**Quan Hệ Phe Phái:** Giờ đây hành động của bạn sẽ ảnh hưởng đến **mối quan hệ với các phe phái** trong thế giới ngầm, mở ra những cơ hội và nguy hiểm mới.",
      "**Thêm Sổ Tay Tri Thức (Codex):** Một cuốn sổ tay trong game cho phép bạn xem lại các định luật, lore về các phe phái và cơ chế của thế giới bất cứ lúc nào.",
      "**Nền Kinh Tế Kép:** Giới thiệu hai loại tiền tệ: **Kim Lệnh** (bề nổi) và **Dấu Ấn Đồng Thau** (thế giới ngầm), mỗi loại có công dụng riêng.",
      "**Hệ Thống Sinh Tồn Mở Rộng:** Thêm chỉ số **Lý Trí (Psyche)** của người chơi và **Năng Lượng Vận Hành** của con rối. Quản lý chúng là chìa khóa để sống sót.",
      "**Vật Phẩm & Quản Lý Túi Đồ:** Triển khai hệ thống túi đồ và thêm các vật phẩm tiêu thụ như 'Dầu Tinh Luyện'.",
    ],
  },
  {
    version: "0.9.0",
    date: "Cập nhật trước",
    title: "Cái Giá Của Sức Mạnh",
    changes: [
      "**Cơ chế Phản Hồi Đồng Cảm:** Khi con rối của bạn chịu sát thương đáng kể, bạn sẽ trải qua một 'Sốc Tinh Thần' (Mental Shock), làm tăng thêm sự căng thẳng của trận chiến.",
      "**Cơ chế Rò Rỉ Tà Năng:** Những đòn đánh cực mạnh hoặc chí mạng giờ đây có thể làm 'Rò Rỉ Tà Năng' qua liên kết, gây ra các ảo giác hình ảnh và âm thanh tạm thời.",
      "Các cơ chế này làm tăng độ khó và sự nhập tâm, nhấn mạnh cái giá phải trả khi điều khiển một cỗ máy chứa đựng sức mạnh cấm kỵ.",
    ],
  },
  {
    version: "0.8.0",
    date: "Cập nhật trước",
    title: "Thế Giới Sống Động Hơn",
    changes: [
      "**Tiểu sử NPC:** Mỗi nhân vật (NPC) mới được tạo ra giờ đây sẽ có một tiểu sử (background) độc đáo, giúp họ trở nên có chiều sâu và đáng nhớ hơn. Bạn có thể xem tiểu sử của họ trong bảng trạng thái.",
      "Cải thiện logic AI để NPC hành xử nhất quán hơn dựa trên tiểu sử và các tương tác trong quá khứ.",
      "Tối ưu hóa việc tạo NPC để không làm ảnh hưởng đến hiệu suất và chi phí token.",
    ],
  },
  {
    version: "0.7.5",
    date: "Cập nhật trước",
    title: "Cải Tiến Giao Diện & Sửa Lỗi",
    changes: [
      "Tinh chỉnh giao diện bảng trạng thái nhân vật để dễ đọc hơn.",
      "Sửa một số lỗi chính tả và ngữ pháp trong các đoạn mô tả.",
      "Cải thiện độ ổn định chung của trò chơi.",
    ],
  },
];
