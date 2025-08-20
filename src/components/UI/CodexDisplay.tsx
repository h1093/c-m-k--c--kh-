import React, { useState } from 'react';
import { FACTION_PATHWAYS, INITIAL_PUPPETS } from '../../data/gameConfig';

const SectionTitle: React.FC<{ title: string; children?: React.ReactNode; color?: string }> = ({ title, children, color = "text-red-500" }) => (
    <div className="mt-8 mb-3 border-b-2 border-red-500/20 pb-2">
        <h3 className={`text-2xl font-cinzel ${color}`}>{title}</h3>
        {children && <p className="text-sm text-gray-400 mt-1">{children}</p>}
    </div>
);

const LoreEntry: React.FC<{ term: string; definition: string; className?: string }> = ({ term, definition, className = "" }) => (
    <div className={`bg-black/30 p-3 border-l-4 border-gray-700 ${className}`}>
        <p className="font-semibold text-red-300">{term}</p>
        <p className="text-sm text-gray-400 mt-1">{definition}</p>
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


type LoreView = 'core' | 'independent' | 'order' | 'neutral' | 'chaos';

const LoreTab: React.FC<{label: string, view: LoreView, activeView: LoreView, setActiveView: (view: LoreView) => void, color: string}> = ({label, view, activeView, setActiveView, color}) => (
    <button 
        onClick={() => setActiveView(view)}
        className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-200 border-b-2 ${
            activeView === view ? `${color} border-current` : 'text-gray-500 border-transparent hover:text-gray-300'
        }`}
    >
        {label}
    </button>
);

const CodexDisplay: React.FC = () => {
  const [activeView, setActiveView] = useState<LoreView>('core');

  const renderContent = () => {
    switch(activeView) {
        case 'independent':
            return (
                 <div className="animate-fade-in">
                    <SectionTitle title="Lộ Trình Độc Lập">
                        Con đường của kẻ tự do, kẻ dị giáo và kẻ điên rồ.
                    </SectionTitle>
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
                    <SectionTitle title="Các Dạng Nguyên Mẫu" color="text-gray-300">
                        Những tạo vật đầu tiên được sinh ra từ sự độc lập, làm ví dụ cho những gì có thể.
                    </SectionTitle>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {INITIAL_PUPPETS.map(puppet => <InitialPuppetCard key={puppet.type} puppet={puppet} />)}
                    </div>
                </div>
            );
        case 'order':
        case 'neutral':
        case 'chaos':
            const schoolMap = {
                order: 'Trật Tự',
                neutral: 'Trung Lập',
                chaos: 'Hỗn Mang'
            };
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
            return (
                <div className="animate-fade-in">
                    <SectionTitle title="Bối Cảnh Xã Hội: Thế Giới Hai Mặt">
                        Thế giới có hai bộ mặt: một cho những người bình thường, và một cho những kẻ bước đi trong bóng tối.
                    </SectionTitle>
                    <div className="space-y-3">
                        <LoreEntry term="Thế Giới Bề Nổi" definition="Đối với đại đa số dân chúng, thế giới vận hành bằng hơi nước và logic sắt thép. Những câu chuyện về 'con rối có linh hồn' chỉ là lời đồn mê tín." />
                        <LoreEntry term="Thế Giới Ngầm và 'Bức Màn' (The Veil)" definition="Trong bóng tối, một xã hội bí mật của các Nghệ Nhân Rối tồn tại, được che giấu bởi 'Bức Màn' - một thỏa thuận ngầm giữa các Phe Phái để ngăn chặn sự thật bị bại lộ. Hành động quá lộ liễu ở nơi công cộng sẽ thu hút sự chú ý của các thế lực nguy hiểm và có thể làm suy yếu 'Bức Màn'." />
                        <LoreEntry term="Vùng Bất Thường (Anomalous Zones)" definition="Những nơi mà ranh giới giữa thế giới vật chất và Linh Giới mỏng manh một cách bất thường. Đây là những địa điểm cực kỳ nguy hiểm, thường là mục tiêu của các 'Hợp Đồng' do sự tập trung cao của Tà Năng và các hiện tượng siêu nhiên." />
                    </div>

                    <SectionTitle title="Nguồn Gốc Sức Mạnh & Mối Đe Dọa Vũ Trụ">
                        Mọi sức mạnh đều có một cái giá, và thực tại của chúng ta chỉ là một hòn đảo nhỏ trong một đại dương hỗn loạn.
                    </SectionTitle>
                    <div className="space-y-3">
                        <LoreEntry term="Linh Giới Cơ Khí" definition="Một chiều không gian của năng lượng hỗn loạn, vô định hình. Đây là nguồn gốc của mọi sức mạnh huyền bí và cũng là nhà của những thực thể không thể tưởng tượng được." />
                        <LoreEntry term="Các Cổ Thần Máy Móc" definition="Những thực thể nguyên thủy, có tri giác được tạo thành từ các định luật vật lý thuần túy, tồn tại trong Linh Giới. Mỗi Lộ Trình Thăng Tiến thực chất là một phương pháp đã được tinh chỉnh để 'tiêu hóa' một cách an toàn một phần đặc tính của một trong số các Cổ Thần này, biến sự điên loạn của chúng thành sức mạnh có thể kiểm soát." />
                        <LoreEntry term="Tà Năng" definition="Năng lượng thô rò rỉ từ Linh Giới, mang theo ảnh hưởng bào mòn và tha hóa của các Cổ Thần. Tiếp xúc trực tiếp sẽ làm biến dạng vật chất và tâm trí." />
                    </div>

                    <SectionTitle title="Phương Pháp Đóng Vai & Mất Kiểm Soát" color="text-gray-300">
                        "Khi bạn nhìn chằm chằm vào vực thẳm cơ khí, vực thẳm cơ khí cũng nhìn chằm chằm vào bạn." - Một Nghệ Nhân Rối đã mất kiểm soát.
                    </SectionTitle>
                    <div className="space-y-3">
                        <LoreEntry term="Phương Pháp Đóng Vai (Nhân Cách)" definition="Định luật quan trọng nhất. Mỗi Thứ Tự trong một Lộ Trình có một bản chất cốt lõi. 'Đóng vai' là hành động và suy nghĩ theo đúng bản chất đó. Đây là cách duy nhất để 'tiêu hóa' sức mạnh một cách an toàn." />
                        <LoreEntry term="Cộng Hưởng" definition="Thước đo mức độ 'tiêu hóa' sức mạnh. Hành động phù hợp với Nhân Cách sẽ tăng Cộng Hưởng. Hành động mâu thuẫn sẽ làm giảm nó, là dấu hiệu cho thấy Tâm Cơ Luân đang bị hư hỏng." />
                        <LoreEntry term="Mất Kiểm Soát" definition="Hậu quả của việc không 'tiêu hóa' được sức mạnh. Khi hành động đi ngược lại Nhân Cách, nó làm hỏng tính toàn vẹn của Tâm Cơ Luân, cho phép ảnh hưởng trực tiếp của Cổ Thần bảo trợ Lộ Trình đó tràn vào. Sự tha hóa này luôn mang tính logic với Lộ Trình (ví dụ: người theo Lộ Trình 'Pháo Đài' sẽ trở nên hoang tưởng cực độ), và gây ra các hiệu ứng tâm lý như ảo giác, hoang tưởng, và nghe thấy những tiếng thì thầm máy móc." />
                    </div>

                    <SectionTitle title="Lộ Trình Thăng Tiến & Cuộc Chiến Vì Thực Tại">
                        Mỗi Lộ Trình là một con đường dẫn đến thần좌, và mỗi bước đi đều có thể là bước cuối cùng.
                    </SectionTitle>
                     <div className="space-y-3">
                        <LoreEntry term="Động Lực Nội Bộ" definition="Các Phe Phái trong cùng một Trường Phái chia sẻ một mục tiêu tối thượng chung, nhưng thường cạnh tranh gay gắt về phương pháp, nguồn lực và ảnh hưởng. Một liên minh giữa họ thường mong manh và đầy toan tính." />
                        <LoreEntry term="Nghi Thức Thăng Tiến" definition="Để tiến lên Thứ Tự tiếp theo, việc có đủ Tinh Hoa Cơ Khí là KHÔNG ĐỦ. Nghệ Nhân Rối trước tiên phải hoàn thành một Nghi Thức—một điều kiện mang tính biểu tượng, thường rất nguy hiểm và kỳ quái. Kiến thức về các Nghi Thức này là bí mật được canh giữ cẩn mật nhất của mỗi Phe Phái." />
                        <LoreEntry term="Tính Duy Nhất & Cuộc Chiến Vì Thực Tại" definition="Các Thứ Tự cao (2, 1, 0) là Duy Nhất. Chỉ có thể có một thực thể nắm giữ vị trí Thần (Thứ Tự 0) của một Lộ Trình. Điều này biến cuộc chiến giữa các Phe Phái thành một cuộc chạy đua để trở thành vị thần duy nhất của khái niệm mà họ đại diện và viết lại các định luật của thực tại." />
                         <LoreEntry term="Thu Phục Kẻ Thù" definition="Một Nghệ Nhân Rối tài năng, sau khi đánh bại một tạo vật cơ khí, có thể cố gắng thực hiện một 'Nghi Thức Thu Phục' thay vì phá hủy nó. Nếu thành công, họ có thể tái chế tạo vật đó thành một Đồng Đội mới hoặc tháo dỡ nó để lấy những Linh Kiện hiếm." />
                    </div>

                    <SectionTitle title="Nền Kinh Tế Ngầm" color="text-yellow-400">
                        Mọi thứ đều có giá của nó, đặc biệt là những thứ bị cấm.
                    </SectionTitle>
                     <div className="space-y-3">
                        <LoreEntry term="Dấu Ấn Đồng Thau" definition="Đơn vị tiền tệ tiêu chuẩn được chấp nhận trong thế giới ngầm của các Nghệ Nhân Rối. Chúng là những đồng xu được khắc các ký hiệu huyền bí, khó làm giả." />
                        <LoreEntry term="Cách Kiếm Dấu Ấn" definition="Các Nghệ Nhân Rối kiếm chúng bằng cách hoàn thành các 'Hợp Đồng' bí mật, bán linh kiện hoặc thông tin trên Chợ Đen, hoặc thực hiện các nhiệm vụ ngầm rủi ro." />
                        <LoreEntry term="Chợ Đen Bánh Răng" definition="Đây không phải là một địa điểm cố định, mà là một mạng lưới những kẻ buôn lậu và các cửa hàng bí mật. Đây là nơi duy nhất để mua các linh kiện hiếm, vật liệu bị cấm và thậm chí cả thông tin về các Nghi Thức Thăng Tiến." />
                        <LoreEntry term="Nhà Đấu Giá Bạc" definition="Một tổ chức trung lập, bí mật chuyên tổ chức các cuộc đấu giá cho những vật phẩm cực kỳ hiếm, như 'Tâm Cơ Luân Di Lại' hoặc các bản thiết kế bị thất lạc. Chỉ những người có danh tiếng hoặc được mời mới có thể tham gia." />
                        <LoreEntry term="Hợp Đồng (Contracts)" definition="Các nhiệm vụ phụ có cấu trúc được đưa ra bởi các Phe Phái hoặc các cá nhân, thường nhắm vào các 'Vùng Bất Thường' để thu hồi vật phẩm, điều tra hiện tượng, hoặc loại bỏ một mối đe dọa." />
                    </div>
                </div>
            )
    }
  }

  return (
    <div className="h-full w-full flex flex-col">
        <div className="border-b border-gray-700 mb-4 flex justify-center gap-4 flex-shrink-0 flex-wrap">
            <LoreTab label="Định Luật Cốt Lõi" view="core" activeView={activeView} setActiveView={setActiveView} color="text-red-400" />
            <LoreTab label="Lộ Trình Độc Lập" view="independent" activeView={activeView} setActiveView={setActiveView} color="text-gray-300" />
            <LoreTab label="Trường Phái Trật Tự" view="order" activeView={activeView} setActiveView={setActiveView} color="text-red-400" />
            <LoreTab label="Trường Phái Trung Lập" view="neutral" activeView={activeView} setActiveView={setActiveView} color="text-gray-300" />
            <LoreTab label="Trường Phái Hỗn Mang" view="chaos" activeView={activeView} setActiveView={setActiveView} color="text-purple-400" />
        </div>
        
        <div className="overflow-y-auto pr-2 flex-grow">
            {renderContent()}
        </div>
    </div>
  );
};

export default CodexDisplay;
