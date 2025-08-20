import type { Puppet } from '../types';

export const INITIAL_PUPPETS: Omit<Puppet, 'name'>[] = [
  {
    type: "Vệ Binh Dây Cót",
    material: "Đồng Thau và Sắt",
    phePhai: "Không Phe Phái",
    loTrinh: "Độc Lập",
    truongPhai: "Trung Lập",
    persona: "Một người bảo vệ kiên định, xem nhiệm vụ là trên hết, đứng vững như một tấm khiên cho chủ nhân.",
    sequence: 9,
    sequenceName: "Học Việc Sắt",
    stats: { hp: 30, maxHp: 30, attack: 5, defense: 8, aberrantEnergy: 0, maxAberrantEnergy: 100, resonance: 50 },
    abilities: [{ name: "Sợi Chỉ Aegis", description: "Kéo căng các sợi chỉ gia cố để khóa chặt các tấm khiên đồng, tăng mạnh phòng thủ trong một lượt."}],
    abilityPool: [
        { name: "Khiên Phản Kích", description: "Sau khi phòng thủ, gây một lượng nhỏ sát thương lên kẻ tấn công." },
        { name: "Tiếng Gầm Khiêu Khích", description: "Buộc kẻ thù phải tập trung tấn công vào con rối trong lượt tiếp theo." },
        { name: "Xung Kích Thép", description: "Một đòn tấn công cơ bản với sức mạnh tăng cường, có thể làm choáng kẻ thù." },
    ],
    mechanicalEssence: 0,
    memoryFragments: [],
    mutations: [],
    componentSlots: { core: 1, frame: 1, actuator: 1 },
    equippedComponents: [],
  },
  {
    type: "Nhà Phân Tích Dây Cót",
    material: "Bạc Đánh Bóng và Thấu Kính Thạch Anh",
    phePhai: "Không Phe Phái",
    loTrinh: "Độc Lập",
    truongPhai: "Trung Lập",
    persona: "Một nhà phân tích máy móc, tìm kiếm các quy luật và logic ẩn sau sự hỗn loạn của thế giới để dự đoán các kết quả có khả năng xảy ra nhất.",
    sequence: 9,
    sequenceName: "Tín Đồ Bánh Răng",
    stats: { hp: 22, maxHp: 22, attack: 7, defense: 6, aberrantEnergy: 0, maxAberrantEnergy: 100, resonance: 50 },
    abilities: [{ name: "Bánh Răng Định Mệnh", description: "Tạm thời tính toán trước chuyển động của kẻ thù, tăng mạnh khả năng né tránh và độ chính xác trong lượt tiếp theo."}],
    abilityPool: [
        { name: "Phân Tích Xác Suất", description: "Gây sát thương và có tỷ lệ cao làm giảm Tấn Công của kẻ thù." },
        { name: "Vòng Lặp Thời Gian", description: "Buộc kẻ thù lặp lại hành động trước đó của chúng với hiệu quả giảm." },
        { name: "Tia Sáng Hiệu Chỉnh", description: "Một đòn tấn công năng lượng chính xác bỏ qua một phần phòng thủ." },
    ],
    mechanicalEssence: 0,
    memoryFragments: [],
    mutations: [],
    componentSlots: { core: 1, frame: 1, actuator: 1 },
    equippedComponents: [],
  },
  {
    type: "Trinh Sát Aether",
    material: "Gỗ Gụ Bóng và Đồng",
    phePhai: "Không Phe Phái",
    loTrinh: "Độc Lập",
    truongPhai: "Trung Lập",
    persona: "Một nhà thám hiểm nhanh nhẹn và tò mò, luôn bị thôi thúc khám phá những điều chưa biết và tìm ra những con đường ẩn giấu.",
    sequence: 9,
    sequenceName: "Tân Binh Dò Đường",
    stats: { hp: 25, maxHp: 25, attack: 8, defense: 4, aberrantEnergy: 0, maxAberrantEnergy: 100, resonance: 50 },
    abilities: [{ name: "Bánh Răng Tăng Tốc", description: "Vận hành với tốc độ chóng mặt, tấn công hai lần trong một lượt."}],
    abilityPool: [
        { name: "Mắt Kính Tinh Xảo", description: "Phân tích điểm yếu của đối thủ, tăng tỷ lệ chí mạng cho đòn tấn công tiếp theo." },
        { name: "Bước Nhảy Tức Thời", description: "Né tránh đòn tấn công tiếp theo của đối thủ." },
        { name: "Lưỡi Dao Gió Xoáy", description: "Tấn công tất cả kẻ địch với sát thương giảm." },
    ],
    mechanicalEssence: 0,
    memoryFragments: [],
    mutations: [],
    componentSlots: { core: 1, frame: 1, actuator: 1 },
    equippedComponents: [],
  },
  {
    type: "Kẻ Xâm Nhập Giả Kim",
    material: "Thủy Tinh Ám Khói và Ống Thủy Ngân",
    phePhai: "Không Phe Phái",
    loTrinh: "Độc Lập",
    truongPhai: "Trung Lập",
    persona: "Một sinh vật của bóng tối và sự lừa dối, tin rằng chiến thắng đến từ mưu mẹo chứ không phải vũ lực.",
    sequence: 9,
    sequenceName: "Tập Sự Bóng Tối",
    stats: { hp: 20, maxHp: 20, attack: 10, defense: 2, aberrantEnergy: 0, maxAberrantEnergy: 100, resonance: 50 },
    abilities: [{ name: "Lọ Bom Khói", description: "Giải phóng một làn sương mù dày đặc gây mất phương hướng, tạm thời trở nên khó bị tấn công hơn."}],
    abilityPool: [
        { name: "Mũi Tiêm Axit", description: "Gây sát thương theo thời gian và làm giảm phòng thủ của mục tiêu." },
        { name: "Ảo Ảnh Gương", description: "Tạo một bản sao tạm thời, thu hút một phần sát thương." },
        { name: "Đòn Đánh Lén", description: "Gây thêm sát thương nếu con rối có HP cao hơn đối thủ." },
    ],
    mechanicalEssence: 0,
    memoryFragments: [],
    mutations: [],
    componentSlots: { core: 1, frame: 1, actuator: 1 },
    equippedComponents: [],
  },
  {
    type: "Cỗ Máy Thí Nghiệm",
    material: "Sắt Gỉ và Dây Chằng Sinh Học",
    phePhai: "Không Phe Phái",
    loTrinh: "Độc Lập",
    truongPhai: "Trung Lập",
    persona: "Một cỗ máy được tạo ra từ những thí nghiệm táo bạo, kết hợp các bộ phận cơ khí và vật liệu không ổn định, tin rằng sức mạnh thực sự đòi hỏi phải chấp nhận rủi ro.",
    sequence: 9,
    sequenceName: "Kẻ Hy Sinh",
    stats: { hp: 28, maxHp: 28, attack: 11, defense: 1, aberrantEnergy: 10, maxAberrantEnergy: 100, resonance: 50 },
    abilities: [{ name: "Tự Nạp Tà Năng", description: "Hấp thụ năng lượng hỗn loạn, tăng mạnh Tấn công trong một lượt nhưng phải chịu một lượng nhỏ sát thương và tăng Tà Năng."}],
    abilityPool: [
        { name: "Cánh Tay Pít-tông", description: "Một đòn tấn công mạnh mẽ có thể làm choáng kẻ thù nhưng cũng có tỷ lệ nhỏ tự gây sát thương." },
        { name: "Tiếng Gầm Hỗn Loạn", description: "Gây sợ hãi cho kẻ thù, làm giảm Phòng Thủ của chúng." },
        { name: "Tái Tạo Bất Ổn", description: "Hồi một lượng HP ngẫu nhiên trong vài lượt, nhưng cũng tăng Tà Năng." },
    ],
    mechanicalEssence: 0,
    memoryFragments: [],
    mutations: [],
    componentSlots: { core: 1, frame: 1, actuator: 1 },
    equippedComponents: [],
  },
];

export const FACTION_PATHWAYS = [
    // --- TRẬT TỰ ---
    {
        name: "Pháo Đài",
        faction: "Trường Phái Hộ Vệ",
        school: "Trật Tự",
        schoolGoal: "Áp đặt các định luật có thể dự đoán được lên vũ trụ",
        description: "Triết lý 'phòng thủ tuyệt đối'. Họ là quân đội của Trường Phái Trật Tự, bảo vệ các thành trì khỏi sự hỗn loạn bằng kỷ luật thép và những cỗ máy phòng thủ gần như không thể xuyên thủng. Cấu trúc của họ mang tính quân phiệt, với các pháo đài ẩn giấu ở những vị trí chiến lược.",
        sequences: [
            { seq: 9, name: "Lính Gác" },
            { seq: 8, name: "Thợ Rèn Khiên" },
            { seq: 7, name: "Người Giữ Cổng" },
        ]
    },
    {
        name: "Nhà Tiên Tri",
        faction: "Giáo Hội Đồng Hồ",
        school: "Trật Tự",
        schoolGoal: "Áp đặt các định luật có thể dự đoán được lên vũ trụ",
        description: "Những nhà thần học máy móc tin rằng vũ trụ là một cỗ máy đồng hồ vĩ đại. Phương pháp của họ là tiên tri và thao túng vi mô, nhằm 'hiệu chỉnh' thực tại để nó khớp với 'Thiết Kế Vĩ Đại'. Họ hoạt động trong các thánh đường ẩn giấu, đầy những thiết bị thiên văn phức tạp.",
        sequences: [
            { seq: 9, name: "Người Theo Dõi Bánh Răng" },
            { seq: 8, name: "Nhà Chiêm Tinh Dây Cót" },
            { seq: 7, name: "Nhà Toán Học Định Mệnh" },
        ]
    },
    {
        name: "Giám Ngục",
        faction: "Viện Giám Sát",
        school: "Trật Tự",
        schoolGoal: "Áp đặt các định luật có thể dự đoán được lên vũ trụ",
        description: "Cảnh sát bí mật của Trường Phái Trật Tự với triết lý 'sự ổn định bằng mọi giá'. Họ sử dụng những con rối 'Giám Ngục' để tạo ra các 'nhà tù khái niệm', giam giữ không chỉ cơ thể mà cả ý thức của kẻ dị giáo. Hoạt động từ các pháo đài ẩn giấu bên dưới các tòa nhà chính phủ, phương pháp của họ tàn nhẫn và không khoan nhượng.",
        sequences: [
            { seq: 9, name: "Cai Ngục" },
            { seq: 8, name: "Kẻ Xiềng Xích" },
            { seq: 7, name: "Thợ Săn Dị Giáo" },
        ]
    },
    {
        name: "Thợ Rèn Bậc Thầy",
        faction: "Hợp Tác Xã Thợ Rèn",
        school: "Trật Tự",
        schoolGoal: "Áp đặt các định luật có thể dự đoán được lên vũ trụ",
        description: "Một liên minh của những nghệ nhân tài ba, tôn thờ sự hoàn hảo cơ khí như đỉnh cao của trật tự. Họ không tìm kiếm quyền lực chính trị, mà là sự thống trị về công nghệ. Phương pháp của họ là chế tạo và độc quyền những vũ khí và linh kiện mạnh nhất, hoạt động thông qua một mạng lưới các xưởng chế tác bí mật.",
        sequences: [
            { seq: 9, name: "Thợ Học Việc" },
            { seq: 8, name: "Thợ Thủ Công" },
            { seq: 7, name: "Người Thổi Hồn" },
        ]
    },
    {
        name: "Nhà Lưu Trữ",
        faction: "Thư Viện Đồng Thau",
        school: "Trật Tự",
        schoolGoal: "Áp đặt các định luật có thể dự đoán được lên vũ trụ",
        description: "Những học giả bị ám ảnh bởi việc thu thập và phân loại mọi kiến thức, tin rằng tri thức là chìa khóa để kiểm soát thực tại. Họ không trực tiếp tham gia xung đột, mà âm thầm thao túng các phe phái khác bằng cách cung cấp hoặc che giấu thông tin. Trụ sở chính của họ là một thư viện bán-thực tại, chỉ có thể tiếp cận qua những cánh cửa ẩn giấu.",
        sequences: [
            { seq: 9, name: "Người Ghi Chép" },
            { seq: 8, name: "Nhà Phân Loại" },
            { seq: 7, name: "Thủ Thư Ký Ức" },
        ]
    },
    // --- TRUNG LẬP ---
    {
        name: "Kẻ Lữ Hành",
        faction: "Hội Người Dò Đường",
        school: "Trung Lập",
        schoolGoal: "Tích lũy tri thức và quyền lực để sinh tồn và trục lợi",
        description: "Với triết lý 'tri thức là trên hết', họ là những nhà thám hiểm và gián điệp của thế giới ngầm. Phương pháp của họ là xâm nhập, thu thập và bán thông tin cho bất kỳ ai trả giá cao nhất, nhằm phục vụ mục tiêu cuối cùng của riêng họ: tìm ra 'Axis Mundi', điểm kiểm soát lý thuyết của Linh Giới.",
        sequences: [
            { seq: 9, name: "Người Dẫn Lối" },
            { seq: 8, name: "Nhà Trinh Sát" },
            { seq: 7, name: "Kẻ Bước Trong Gió" },
        ]
    },
    {
        name: "Bóng Ma",
        faction: "Hiệp Hội Lãng Khách",
        school: "Trung Lập",
        schoolGoal: "Tích lũy tri thức và quyền lực để sinh tồn và trục lợi",
        description: "Một tổ chức lính đánh thuê phi tập trung, chỉ trung thành với hợp đồng và 'Dấu Ấn Đồng Thau'. Triết lý của họ là 'sức mạnh cá nhân quyết định tất cả'. Họ không có lý tưởng, chỉ có bộ quy tắc danh dự nghiêm ngặt của riêng mình về việc hoàn thành hợp đồng.",
        sequences: [
            { seq: 9, name: "Kẻ Rình Rập" },
            { seq: 8, name: "Sát Thủ Vô Hình" },
            { seq: 7, name: "Lưỡi Dao Của Gió" },
        ]
    },
    {
        name: "Kẻ Lừa Gạt",
        faction: "Gánh Hát Tự Động",
        school: "Trung Lập",
        schoolGoal: "Tích lũy tri thức và quyền lực để sinh tồn và trục lợi",
        description: "Một đoàn kịch lưu động gồm những con rối kỳ lạ, sử dụng triết lý 'thực tại là một sân khấu'. Phương pháp của họ là ảo ảnh, sự lừa dối và thao túng tâm lý để sinh tồn, đánh cắp bí mật và đôi khi gây ra sự hỗn loạn chỉ để 'thưởng thức màn kịch'.",
        sequences: [
            { seq: 9, name: "Diễn Viên Phụ" },
            { seq: 8, name: "Nhà Ảo Thuật" },
            { seq: 7, name: "Kẻ Múa Rối" },
        ]
    },
     {
        name: "Nhà Môi Giới",
        faction: "Chợ Đen Bánh Răng",
        school: "Trung Lập",
        schoolGoal: "Tích lũy tri thức và quyền lực để sinh tồn và trục lợi",
        description: "Một mạng lưới tội phạm có tổ chức kiểm soát nền kinh tế ngầm. Triết lý của họ là 'mọi thứ đều có giá'. Họ không quan tâm đến cuộc chiến ý thức hệ, chỉ tập trung vào việc buôn lậu công nghệ bị cấm và làm giàu từ xung đột của các phe phái khác.",
        sequences: [
            { seq: 9, name: "Người Học Việc" },
            { seq: 8, name: "Nhà Thẩm Định" },
            { seq: 7, name: "Kẻ Săn Cổ Vật" },
        ]
    },
    {
        name: "Kẻ Tái Chế",
        faction: "Những Người Sống Sót",
        school: "Trung Lập",
        schoolGoal: "Tích lũy tri thức và quyền lực để sinh tồn và trục lợi",
        description: "Một cộng đồng những nghệ nhân rối bị ruồng bỏ, sống sót trong những khu tàn tích. Triết lý của họ là 'sự thích nghi là hình thức sinh tồn tối thượng'. Họ là bậc thầy của việc tái chế và ứng biến, có khả năng biến phế liệu thành những cỗ máy chết người.",
        sequences: [
            { seq: 9, name: "Người Nhặt Rác" },
            { seq: 8, name: "Thợ Sửa Chữa" },
            { seq: 7, name: "Bậc Thầy Tái Chế" },
        ]
    },
    // --- HỖN MANG ---
     {
        name: "Kẻ Vô Diện",
        faction: "Tổ Chức Màn Che",
        school: "Hỗn Mang",
        schoolGoal: "Phá vỡ các quy luật, đưa thực tại trở về trạng thái hỗn mang nguyên thủy",
        description: "Những kẻ theo chủ nghĩa vô chính phủ quỷ quyệt, tin rằng mọi cấu trúc quyền lực đều phải bị phá hủy. Phương pháp của họ là ám sát, phá hoại và gieo rắc sự hoang tưởng, sử dụng những con rối 'Kẻ Vô Diện' để xâm nhập và làm suy tàn các tổ chức từ bên trong.",
        sequences: [
            { seq: 9, name: "Kẻ Bắt Chước" },
            { seq: 8, name: "Người Thay Hình Đổi Dạng" },
            { seq: 7, name: "Kẻ Đánh Cắp Danh Tính" },
        ]
    },
    {
        name: "Kẻ Cuồng Nộ",
        faction: "Cơ Giới Thần Giáo",
        school: "Hỗn Mang",
        schoolGoal: "Phá vỡ các quy luật, đưa thực tại trở về trạng thái hỗn mang nguyên thủy",
        description: "Những kẻ cuồng tín tôn thờ sự hỗn loạn, tin rằng xác thịt là yếu đuối và sự cứu rỗi nằm ở việc hợp nhất với máy móc và Tà Năng. Phương pháp của họ là các nghi lễ hiến tế đẫm máu và những thí nghiệm ghê tởm, biến tín đồ và nạn nhân thành những quái vật nửa người nửa máy.",
        sequences: [
            { seq: 9, name: "Tín Đồ" },
            { seq: 8, name: "Kẻ Điên Loạn" },
            { seq: 7, name: "Cỗ Máy Hủy Diệt" },
        ]
    },
    {
        name: "Bán Thần",
        faction: "Dàn Hợp Xướng Rỉ Sét",
        school: "Hỗn Mang",
        schoolGoal: "Phá vỡ các quy luật, đưa thực tại trở về trạng thái hỗn mang nguyên thủy",
        description: "Một giáo phái tin rằng Linh Giới có thể được 'điều khiển' thông qua các tần số âm thanh bị cấm. Họ tìm cách tạo ra 'Bản Giao Hưởng Hủy Diệt'—một tần số có khả năng làm sụp đổ 'Bức Màn' và hòa tan thực tại vào sự hỗn loạn. Phương pháp của họ là các buổi 'hòa nhạc' bí mật ở các Vùng Bất Thường.",
        sequences: [
            { seq: 9, name: "Người Hát Ru" },
            { seq: 8, name: "Kẻ Gào Thét" },
            { seq: 7, name: "Nhà Soạn Giao Hưởng Hủy Diệt" },
        ]
    },
    {
        name: "Ác Mộng",
        faction: "Hội Những Kẻ Mộng Mơ",
        school: "Hỗn Mang",
        schoolGoal: "Phá vỡ các quy luật, đưa thực tại trở về trạng thái hỗn mang nguyên thủy",
        description: "Những nghệ nhân khám phá ranh giới của thực tại, sử dụng Tà Năng để bẻ cong không gian và tâm trí. Triết lý của họ là 'sự tỉnh táo chỉ là một nhà tù'. Họ không tìm cách thống trị, mà là thoát khỏi các định luật của thực tại, thường phải trả giá bằng chính sự tỉnh táo của mình.",
        sequences: [
            { seq: 9, name: "Kẻ Gây Mất Ngủ" },
            { seq: 8, name: "Kẻ Dệt Mộng" },
            { seq: 7, name: "Ký Sinh Trùng Tâm Trí" },
        ]
    },
    {
        name: "Quái Vật Biến Dị",
        faction: "Nhà Máy Sinh Học",
        school: "Hỗn Mang",
        schoolGoal: "Phá vỡ các quy luật, đưa thực tại trở về trạng thái hỗn mang nguyên thủy",
        description: "Những kẻ dị giáo cấp tiến nhất, coi sự phân biệt giữa máy móc và sinh thể là một sai lầm của tạo hóa. Triết lý của họ là 'sự tiến hóa thông qua sự lai tạp'. Họ thực hiện những thí nghiệm ghép nối ghê tởm, tạo ra những vũ khí sinh học sống và tin rằng đây là hình dạng tối cao của sự sống.",
        sequences: [
            { seq: 9, name: "Nhà Giải Phẫu" },
            { seq: 8, name: "Kẻ Ghép Nội Tạng" },
            { seq: 7, name: "Sự Lai Tạp Gớm Ghiếc" },
        ]
    },
];
