

import React, { useState, useEffect } from 'react';
import { FACTION_PATHWAYS, INITIAL_PUPPETS } from '../data/gameConfig';

const SectionTitle: React.FC<{ title: string; children?: React.ReactNode; color?: string }> = ({ title, children, color = "text-red-500" }) => (
    <div className="mt-8 mb-3 border-b-2 border-red-500/20 pb-2">
        <h3 className={`text-2xl font-cinzel ${color}`}>{title}</h3>
        {children && <p className="text-sm text-gray-400 mt-1">{children}</p>}
    </div>
);

const LoreEntry: React.FC<{ term: string; definition: React.ReactNode; className?: string }> = ({ term, definition, className = "" }) => (
    <div className={`bg-black/30 p-3 border-l-4 border-gray-700 ${className}`}>
        <p className="font-semibold text-red-300">{term}</p>
        <div className="text-sm text-gray-400 mt-1">{definition}</div>
    </div>
);

interface PathwayCardProps {
    pathway: typeof FACTION_PATHWAYS[0];
}

const PathwayCard: React.FC<PathwayCardProps> = ({ pathway }) => {
    let riskDescription = '';
    switch(pathway.school) {
        case 'Trật Tự':
            riskDescription = 'Trở nên cứng nhắc, hoang tưởng, ám ảnh với việc kiểm soát, coi mọi sự ngẫu nhiên là một mối đe dọa cần phải loại bỏ.';
            break;
        case 'Hỗn Mang':
            riskDescription = 'Đánh mất ranh giới giữa bản thân và sự hỗn loạn, cơ thể và tâm trí bị biến đổi một cách ghê tởm, hành động theo những thôi thúc không thể hiểu nổi.';
            break;

        case 'Trung Lập':
            riskDescription = 'Trở nên vô cảm và thực dụng đến tàn nhẫn, coi mọi mối quan hệ và lý tưởng chỉ là công cụ để đạt được mục đích.';
            break;
    }

    return (
        <div className="bg-black/30 p-4 border border-gray-700/50 flex flex-col h-full">
            <h5 className="font-bold text-lg font-cinzel text-gray-200">{pathway.faction}</h5>
            <div className="bg-red-900/30 p-2 my-2 border-t border-b border-red-500/20">
                <p className="text-sm text-red-300"><span className="font-semibold uppercase tracking-wider">Lộ Trình:</span> {pathway.name}</p>
            </div>
            <p className="text-xs text-gray-400 italic mb-3 flex-grow">{pathway.description}</p>
            <div className="bg-purple-900/20 p-2 mt-auto border border-purple-500/30">
                <p className="text-xs text-purple-300"><span className="font-semibold">Rủi Ro Tha Hóa:</span> {riskDescription}</p>
            </div>
        </div>
    );
};

interface InitialPuppetCardProps {
    puppet: typeof INITIAL_PUPPETS[0];
}

const InitialPuppetCard: React.FC<InitialPuppetCardProps> = ({ puppet }) => (
    <div className="bg-black/30 p-4 border border-gray-700/50 flex flex-col h-full">
        <h5 className="font-bold text-lg font-cinzel text-gray-200">{puppet.type}</h5>
        <p className="text-xs text-gray-500 italic mb-3">Vật liệu: {puppet.material}</p>
        <div className="bg-red-900/20 p-2 mt-auto border border-red-500/30">
            <p className="text-xs text-red-300"><span className="font-semibold">Nhân Cách:</span> {puppet.persona}</p>
        </div>
    </div>
);

// Core Content Components
const CoreTopic_XaHoi = () => (<><SectionTitle title="Bối Cảnh Xã Hội: Thế Giới Hai Mặt" children="Thế giới có hai bộ mặt: một cho những người bình thường, và một cho những kẻ bước đi trong bóng tối." /><div className="space-y-3"><LoreEntry term="Thế Giới Bề Nổi" definition="Đối với đại đa số dân chúng, thế giới vận hành bằng hơi nước và logic sắt thép. Những câu chuyện về 'con rối có linh hồn' chỉ là lời đồn mê tín." /><LoreEntry term="Thế Giới Ngầm và 'Bức Màn' (The Veil)" definition="Trong bóng tối, một xã hội bí mật của các Nghệ Nhân Rối tồn tại, được che giấu bởi 'Bức Màn' - một thỏa thuận ngầm giữa các Phe Phái để ngăn chặn sự thật bị bại lộ. Hành động quá lộ liễu ở nơi công cộng sẽ thu hút sự chú ý của các thế lực nguy hiểm." /><LoreEntry term="Vùng Bất Thường (Anomalous Zones)" definition="Những nơi mà ranh giới giữa thế giới vật chất và Linh Giới mỏng manh một cách bất thường. Đây là những địa điểm cực kỳ nguy hiểm, thường là mục tiêu của các 'Hợp Đồng' do sự tập trung cao của Tà Năng và các hiện tượng siêu nhiên." /></div></>);
const CoreTopic_NguonGoc = () => (<><SectionTitle title="Nguồn Gốc Sức Mạnh & Mối Đe Dọa Vũ Trụ" children="Mọi sức mạnh đều có một cái giá, và thực tại của chúng ta chỉ là một hòn đảo nhỏ trong một đại dương hỗn loạn." /><div className="space-y-3"><LoreEntry term="Linh Giới Cơ Khí" definition="Một chiều không gian của năng lượng hỗn loạn, vô định hình. Đây là nguồn gốc của mọi sức mạnh huyền bí và cũng là nhà của những thực thể không thể tưởng tượng được (Các Cổ Thần Máy Móc)." /><LoreEntry term="Tà Năng (Aberrant Energy)" definition="Năng lượng thô rò rỉ từ Linh Giới, mang theo ảnh hưởng bào mòn và tha hóa của các Cổ Thần. Tiếp xúc trực tiếp sẽ làm biến dạng vật chất và tâm trí." /><LoreEntry term="Tâm Cơ Luân (Mind-Cogwheels)" definition="Trái tim của một con rối. Một thiết bị huyền bí có khả năng 'dịch' Tà Năng hỗn loạn từ Linh Giới thành sức mạnh có thể điều khiển được." /><LoreEntry term="Tinh Hoa Cơ Khí (Mechanical Essence)" definition="Sản phẩm phụ tinh khiết được tạo ra trong quá trình 'dịch' Tà Năng. Đây là nhiên liệu cần thiết để thực hiện 'Tinh Luyện' - quá trình nâng cấp và thăng tiến Thứ Tự của con rối." /></div></>);
const CoreTopic_DongVai = () => (<><SectionTitle title="Phương Pháp Đóng Vai & Mất Kiểm Soát" color="text-gray-300" children='"Khi bạn nhìn chằm chằm vào vực thẳm cơ khí, vực thẳm cơ khí cũng nhìn chằm chằm vào bạn." - Một Nghệ Nhân Rối đã mất kiểm soát.' /><div className="space-y-3"><LoreEntry term="Phương Pháp Đóng Vai (Nhân Cách)" definition="Định luật quan trọng nhất. Mỗi Thứ Tự trong một Lộ Trình có một bản chất cốt lõi. 'Đóng vai' là hành động và suy nghĩ theo đúng bản chất đó. Đây là cách duy nhất để 'tiêu hóa' sức mạnh một cách an toàn." /><LoreEntry term="Cộng Hưởng (Resonance)" definition="Thước đo mức độ 'tiêu hóa' sức mạnh. Hành động phù hợp với Nhân Cách sẽ tăng Cộng Hưởng. Hành động mâu thuẫn sẽ làm giảm nó, là dấu hiệu cho thấy Tâm Cơ Luân đang bị hư hỏng." /><LoreEntry term="Mất Kiểm Soát" definition="Hậu quả của việc không 'tiêu hóa' được sức mạnh. Khi hành động đi ngược lại Nhân Cách, nó làm hỏng tính toàn vẹn của Tâm Cơ Luân, cho phép ảnh hưởng trực tiếp của Cổ Thần bảo trợ Lộ Trình đó tràn vào, gây ra các hiệu ứng tâm lý như ảo giác, hoang tưởng, và nghe thấy những tiếng thì thầm máy móc." /></div></>);
const CoreTopic_LienKet = () => (<><SectionTitle title="Cái Giá Của Sự Liên Kết" color="text-yellow-400" children="Liên kết giữa bạn và con rối là một cây cầu hai chiều." /><div className="space-y-3"><LoreEntry term="Phản Hồi Đồng Cảm (Sympathetic Feedback)" definition="Khi con rối chịu sát thương đáng kể, một dư chấn của sự hủy diệt đó sẽ dội ngược lại và tấn công vào tâm trí bạn dưới dạng một cú sốc tinh thần, có thể tạm thời làm lung lay ý chí và giảm Cộng Hưởng." /><LoreEntry term="Rò Rỉ Tà Năng (Aberrant Energy Leak)" definition="Những đòn đánh cực mạnh có thể tạo ra những vết nứt tạm thời trong Tâm Cơ Luân. Qua đó, Tà Năng thô sẽ rò rỉ ngược lại và xâm nhập vào nhận thức của bạn, gây ra những ảo giác ngắn và làm tăng Tà Năng của con rối." /><LoreEntry term="Gánh Nặng Chỉ Huy (The Burden of Command)" definition="Sở hữu nhiều đồng đội mang lại lợi thế chiến thuật, nhưng phải trả giá bằng sự tập trung của Nghệ Nhân Rối. Mỗi đồng đội sẽ làm giảm nhẹ Cộng Hưởng với con rối chính của bạn và bào mòn giới hạn Lý Trí tối đa của bạn. Việc chỉ huy một đội quân máy móc là một gánh nặng không hề nhỏ."/></div></>);
const CoreTopic_SinhTon = () => (<><SectionTitle title="Định Luật Sinh Tồn: Lý Trí và Năng Lượng" color="text-yellow-400" children="Cái giá của việc điều khiển rối không chỉ là sự hao mòn của máy móc." /><div className="space-y-3"><LoreEntry term="Lý Trí (Psyche)" definition="Đại diện cho sự ổn định tinh thần của chính bạn, Nghệ Nhân Rối. Chứng kiến các sự kiện kinh hoàng, thất bại trong việc 'đóng vai' hoặc bị ảnh hưởng bởi Tà Năng sẽ làm giảm Lý Trí. Lý Trí thấp sẽ gây ra ảo giác, hoang tưởng và có thể thay đổi các lựa chọn của bạn." /><LoreEntry term="Năng Lượng Vận Hành" definition="Nhiên liệu cho Tâm Cơ Luân, nó sẽ giảm dần theo thời gian và khi sử dụng kỹ năng. Năng lượng thấp làm con rối hoạt động kém hiệu quả, chậm chạp và có thể không tuân theo các mệnh lệnh phức tạp." /></div></>);
const CoreTopic_ThangTien = () => (<><SectionTitle title="Lộ Trình Thăng Tiến & Cuộc Chiến Vì Thực Tại" children="Mỗi Lộ Trình là một con đường dẫn đến thần좌, và mỗi bước đi đều có thể là bước cuối cùng." /><div className="space-y-3"><LoreEntry term="Thứ Tự (Sequence)" definition="Con đường tiến hóa của một con rối được chia thành các cấp bậc từ 9 (thấp nhất) đến 0 (Thần). Mỗi bước thăng tiến mở ra sức mạnh mới." /><LoreEntry term="Nguyên Liệu Thăng Tiến" definition="Để thăng tiến lên các Thứ Tự cao hơn, ngoài Tinh Hoa Cơ Khí, bạn cần phải tìm kiếm các Linh Kiện Huyền Bí đặc biệt. Mỗi Lộ Trình sẽ yêu cầu những nguyên liệu khác nhau, chỉ có thể tìm thấy bằng cách khám phá thế giới, đánh bại kẻ thù hùng mạnh, hoặc hoàn thành các Hợp Đồng nguy hiểm. Điều này khiến mỗi bước thăng tiến là một thành tựu đáng giá." /><LoreEntry term="Mục Tiêu Tối Thượng" definition="Cuộc chiến giữa các Phe Phái là để chiếm lấy vị trí Thứ Tự 0 và viết lại vĩnh viễn các định luật của thực tại theo ý muốn của họ." /><LoreEntry term="Nghi Thức Thăng Tiến" definition="Để tiến lên Thứ Tự tiếp theo, Nghệ Nhân Rối phải hoàn thành một Nghi Thức—một điều kiện mang tính biểu tượng, thường rất nguy hiểm. Kiến thức về các Nghi Thức này là bí mật được canh giữ cẩn mật nhất của mỗi Phe Phái." /><LoreEntry term="Thu Phục Kẻ Thù" definition="Sau khi đánh bại một kẻ địch máy móc có cấu trúc còn nguyên vẹn, bạn sẽ có lựa chọn: 'Tháo Dỡ' để lấy linh kiện và Tinh Hoa, hoặc thực hiện 'Nghi Thức Thu Phục'. Nghi thức này là một canh bạc: nếu thành công, bạn sẽ có một Đồng Đội mới; nếu thất bại, cỗ máy có thể bị phá hủy hoàn toàn, thậm chí gây hại ngược lại cho bạn." /></div></>);
const CoreTopic_KinhTe = () => (<><SectionTitle title="Nền Kinh Tế Hai Mặt" color="text-yellow-400" children="Mọi thứ đều có giá của nó, đặc biệt là những thứ bị cấm." /><div className="space-y-3"><LoreEntry term="Kim Lệnh (Crowns)" definition="Tiền tệ tiêu chuẩn của thế giới bề nổi. Dùng cho các giao dịch thông thường như mua vật tư, thực phẩm, hoặc hối lộ lính gác." /><LoreEntry term="Dấu Ấn Đồng Thau (Brass Marks)" definition="Đơn vị tiền tệ được chấp nhận trong thế giới ngầm. Dùng để giao dịch các công nghệ bị cấm, thuê lính đánh thuê, và quan trọng nhất, tham gia vào các cuộc đấu giá tại Chợ Đen Bánh Răng để giành lấy những Linh Kiện Huyền Bí cực kỳ hiếm." /><LoreEntry term="Chợ Đen Bánh Răng & Nhà Đấu Giá" definition={<><p>Đây không phải là một địa điểm cố định, mà là một <strong>mạng lưới di động</strong> và là trung tâm quyền lực của thế giới ngầm. Các phiên đấu giá và giao dịch bí mật sẽ được tổ chức vào những thời điểm khác nhau. Cơ hội để tham gia sẽ <strong>xuất hiện định kỳ</strong> khi bạn đang ở một khu vực an toàn và có đủ Dấu Ấn Đồng Thau để chứng tỏ vị thế của mình.</p><p className="mt-2">Tại đây, Dấu Ấn Đồng Thau được dùng để:<ul className="list-disc list-inside mt-2 space-y-1"><li><strong className="text-gray-300">Mua Linh Kiện Huyền Bí:</strong> Giành lấy những nguyên liệu thăng tiến cực hiếm.</li><li><strong className="text-gray-300">Bán Vật Phẩm Hiếm:</strong> Đấu giá những linh kiện hoặc cổ vật bạn tìm được để làm giàu.</li><li><strong className="text-gray-300">Mua Bán Thông Tin & Hợp Đồng:</strong> Đấu giá để có được những thông tin mật có thể dẫn đến kho báu, hoặc nhận lấy những Hợp Đồng nguy hiểm nhưng có phần thưởng hậu hĩnh.</li></ul></p></>} /><LoreEntry term="Quy Tắc Vàng" definition="Không bao giờ nhầm lẫn hai loại tiền tệ. Sử dụng sai loại tiền tệ ở sai nơi sẽ thu hút sự chú ý không mong muốn và cực kỳ nguy hiểm." /><LoreEntry term="Hợp Đồng & Cách Tìm Kiếm" definition={<p>Hợp Đồng là các nhiệm vụ phụ mà bạn có thể nhận để kiếm phần thưởng. Để chủ động tìm kiếm chúng, hãy:<ul className="list-disc list-inside mt-2 space-y-1"><li><strong className="text-gray-300">Lắng nghe tin đồn:</strong> Tại các quán rượu hoặc khu chợ đen, hãy tìm kiếm lựa chọn để hóng chuyện.</li><li><strong className="text-gray-300">Kiểm tra Bảng Thông Báo:</strong> Trong các thành phố hoặc khu định cư, có thể có các bảng thông báo đăng tải công việc.</li><li><strong className="text-gray-300">Liên hệ từ Phe Phái:</strong> Các phe phái có thể trực tiếp tìm đến bạn để giao nhiệm vụ nếu mối quan hệ của bạn với họ đủ đặc biệt.</li><li><strong className="text-gray-300">Duyệt Nhà Đấu Giá:</strong> Những Hợp Đồng béo bở nhất đôi khi được "đấu giá" cho người trả giá cao nhất tại Chợ Đen Bánh Răng.</li></ul></p>} /></div></>);
const CoreTopic_TuongTac = () => (<><SectionTitle title="Cơ Chế Tương Tác" color="text-yellow-400" children="Các quy tắc và lựa chọn định hình cuộc phiêu lưu của bạn." /><div className="space-y-3"><LoreEntry term="Nút Gợi Ý (Hint Button)" definition="Nếu bạn cảm thấy bế tắc và không chắc chắn về hành động tiếp theo, nút 'Gợi ý' sẽ yêu cầu Người Dẫn Lối (AI) cung cấp một lời khuyên tinh tế. Gợi ý này sẽ dựa trên tình hình hiện tại, các nhiệm vụ và manh mối bạn có, nhằm định hướng bạn đi đúng hướng mà không phá hỏng trải nghiệm khám phá." /><LoreEntry term="Hành Động Tùy Chỉnh (Custom Action Input)" definition="Bên dưới các lựa chọn có sẵn, bạn sẽ thấy một ô nhập văn bản. Hãy sử dụng nó để thực hiện bất kỳ hành động nào bạn có thể nghĩ ra, ví dụ: 'Tôi kiểm tra chiếc đồng hồ trên bàn' hoặc 'Tôi hỏi người bán hàng về những tin đồn gần đây'. Người Ký Sự (AI) sẽ diễn giải và phản hồi lại hành động của bạn, mang lại sự tự do tối đa để định hình câu chuyện, đặc biệt là để trò chuyện trực tiếp với các nhân vật bạn gặp." /></div></>);


const coreTopics = [
  { id: 'xa_hoi', title: 'Bối Cảnh Xã Hội', subtitle: 'Thế giới hai mặt: một cho người thường, một cho kẻ đi trong bóng tối.', content: <CoreTopic_XaHoi /> },
  { id: 'nguon_goc', title: 'Nguồn Gốc Sức Mạnh', subtitle: 'Mọi sức mạnh đều có một cái giá trong đại dương hỗn loạn.', content: <CoreTopic_NguonGoc /> },
  { id: 'dong_vai', title: 'Phương Pháp Đóng Vai', subtitle: '"Khi bạn nhìn vào vực thẳm cơ khí, nó cũng nhìn lại bạn."', content: <CoreTopic_DongVai /> },
  { id: 'lien_ket', title: 'Cái Giá Của Sự Liên Kết', subtitle: 'Liên kết giữa bạn và con rối là một cây cầu hai chiều.', content: <CoreTopic_LienKet /> },
  { id: 'sinh_ton', title: 'Định Luật Sinh Tồn', subtitle: 'Cái giá của việc điều khiển không chỉ là sự hao mòn máy móc.', content: <CoreTopic_SinhTon /> },
  { id: 'thang_tien', title: 'Lộ Trình Thăng Tiến', subtitle: 'Mỗi Lộ Trình là một con đường dẫn đến thần좌.', content: <CoreTopic_ThangTien /> },
  { id: 'kinh_te', title: 'Nền Kinh Tế', subtitle: 'Mọi thứ đều có giá, đặc biệt là những thứ bị cấm.', content: <CoreTopic_KinhTe /> },
  { id: 'tuong_tac', title: 'Cơ Chế Tương Tác', subtitle: 'Các quy tắc và lựa chọn định hình cuộc phiêu lưu của bạn.', content: <CoreTopic_TuongTac /> },
];

type LoreView = 'core' | 'independent' | 'order' | 'neutral' | 'chaos';

const LoreTab: React.FC<{label: string, view: LoreView, activeView: LoreView, setActiveView: (view: LoreView) => void, color: string}> = ({label, view, activeView, setActiveView, color}) => (
    <button 
        onClick={() => setActiveView(view)}
        className={`w-full text-left p-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 border-l-4 ${
            activeView === view ? `${color} border-current bg-red-900/20` : 'text-gray-400 border-transparent hover:bg-gray-800/50 hover:text-white'
        }`}
    >
        {label}
    </button>
);


interface CodexScreenProps {
  onExit: () => void;
}

const CodexScreen: React.FC<CodexScreenProps> = ({ onExit }) => {
  const [activeView, setActiveView] = useState<LoreView>('core');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoreTopic, setSelectedCoreTopic] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCoreTopic(null);
  }, [activeView]);

  const renderContent = () => {
    switch(activeView) {
        case 'independent':
            return (
                 <div className="animate-fade-in">
                    <SectionTitle title="Lộ Trình Độc Lập" children="Con đường của kẻ tự do, kẻ dị giáo và kẻ điên rồ." />
                    <div className="space-y-3">
                        <LoreEntry 
                            term="Bản Chất Của Sự Tự Do" 
                            definition="Đây không phải là một con đường có sẵn, mà là hành động cực kỳ nguy hiểm của việc tạo ra một Lộ Trình hoàn toàn mới từ sự hỗn loạn của Linh Giới, cố gắng thiết lập một kết nối mới với một Cổ Thần chưa được biết đến. Nhân Cách của con rối chính là bản thiết kế mà người chơi đang tự viết nên." 
                        />
                         <LoreEntry 
                            term="Cái Giá Của Sự Sáng Tạo" 
                            definition="Con đường này mang lại sự tự do tuyệt đối để tạo ra những sức mạnh độc nhất, nhưng cái giá phải trả là nguy cơ Mất Kiểm Soát cực kỳ cao và việc phải tự mình khám phá ra các Nghi Thức Thăng Tiến gần như là không thể. Mỗi bước đi là một canh bạc với sự tỉnh táo." 
                        />
                    </div>
                    <SectionTitle title="Các Dạng Nguyên Mẫu" color="text-gray-300" children="Những tạo vật đầu tiên được sinh ra từ sự độc lập, làm ví dụ cho những gì có thể." />
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {INITIAL_PUPPETS.map(puppet => <InitialPuppetCard key={puppet.type} puppet={puppet} />)}
                    </div>
                </div>
            );
        case 'order':
        case 'neutral':
        case 'chaos':
            const schoolMap = { order: 'Trật Tự', neutral: 'Trung Lập', chaos: 'Hỗn Mang' };
            const pathways = FACTION_PATHWAYS.filter(p => p.school === schoolMap[activeView]);
            return (
                <div className="animate-fade-in">
                    <p className="text-center italic text-gray-400 mt-4 mb-6">{pathways[0]?.schoolGoal}</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pathways.map(pathway => <PathwayCard key={pathway.name} pathway={pathway} />)}
                    </div>
                </div>
            );
        case 'core':
        default:
            if (selectedCoreTopic) {
                const topic = coreTopics.find(t => t.id === selectedCoreTopic);
                return (
                    <div className="animate-fade-in">
                        <button onClick={() => setSelectedCoreTopic(null)} className="ui-button text-sm py-1 px-4 mb-6 bg-gray-800 border-gray-700 hover:bg-gray-700/80">
                            &larr; Quay Lại Mục Lục
                        </button>
                        {topic?.content}
                    </div>
                );
            }

            return (
                <div className="animate-fade-in">
                    <SectionTitle title="Định Luật Cốt Lõi" children="Những quy tắc nền tảng định hình nên thực tại tàn khốc này. Chọn một chủ đề để tìm hiểu sâu hơn." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {coreTopics.map(topic => (
                            <button 
                                key={topic.id}
                                onClick={() => setSelectedCoreTopic(topic.id)}
                                className="ui-panel text-left p-4 hover:bg-gray-800/60 transition-all duration-200 border border-gray-700/50 hover:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                            >
                                <h4 className="font-bold text-red-300 font-cinzel text-lg">{topic.title}</h4>
                                <p className="text-xs text-gray-400 mt-1">{topic.subtitle}</p>
                            </button>
                        ))}
                    </div>
                </div>
            );
    }
  }

  const navItems = [
      { label: "Định Luật Cốt Lõi", view: 'core' as LoreView, color: 'text-red-400' },
      { label: "Lộ Trình Độc Lập", view: 'independent' as LoreView, color: 'text-gray-300' },
      { label: "Trường Phái Trật Tự", view: 'order' as LoreView, color: 'text-red-400' },
      { label: "Trường Phái Trung Lập", view: 'neutral' as LoreView, color: 'text-gray-300' },
      { label: "Trường Phái Hỗn Mang", view: 'chaos' as LoreView, color: 'text-purple-400' },
  ];

  const filteredNavItems = navItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen w-screen flex p-4 md:p-6 gap-6 animate-fade-in">
        {/* Sidebar Navigation */}
        <aside className="w-1/4 lg:w-1/5 flex-shrink-0 flex flex-col ui-panel p-4">
             <h2 className="text-2xl font-cinzel text-red-500 text-center mb-4 border-b border-red-500/20 pb-3">Sổ Tay Tri Thức</h2>
             
             <div className="relative mb-4 flex-shrink-0">
                <input
                    type="text"
                    placeholder="Tra cứu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ui-input w-full pl-8 pr-2 py-2 text-sm"
                    aria-label="Tra cứu sổ tay tri thức"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>

             <nav className="flex-grow space-y-2 overflow-y-auto">
                 {filteredNavItems.map(item => (
                    <LoreTab
                        key={item.view}
                        label={item.label}
                        view={item.view}
                        activeView={activeView}
                        setActiveView={setActiveView}
                        color={item.color}
                    />
                 ))}
                 {filteredNavItems.length === 0 && (
                    <p className="text-center text-sm text-gray-500 p-4">Không tìm thấy kết quả.</p>
                 )}
             </nav>
              <div className="mt-6 flex-shrink-0 border-t border-red-500/20 pt-4">
                <button onClick={onExit} className="ui-button w-full py-2 px-8">
                    Quay Lại
                </button>
            </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-grow ui-panel p-6 overflow-y-auto">
            {renderContent()}
        </main>
    </div>
  );
};

export default CodexScreen;