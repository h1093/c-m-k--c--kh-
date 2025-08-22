
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
    title: "Định Luật Sinh Tồn",
    changes: [
      "**Thêm chỉ số Lý Trí (Psyche):** Bây giờ bạn phải quản lý sự ổn định tinh thần của chính mình. Chứng kiến các sự kiện kinh hoàng sẽ làm giảm Lý Trí, dẫn đến ảo giác và các lựa chọn bất thường.",
      "**Thêm Năng Lượng Vận Hành:** Con rối của bạn giờ đây tiêu thụ năng lượng để hoạt động. Sử dụng kỹ năng và duy trì hoạt động sẽ làm cạn kiệt năng lượng, ảnh hưởng đến hiệu quả chiến đấu.",
      "**Thêm vật phẩm:** 'Dầu Tinh Luyện' đã được thêm vào như một cách để phục hồi Năng Lượng Vận Hành.",
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
