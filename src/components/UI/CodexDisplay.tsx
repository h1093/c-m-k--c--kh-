
import React, { useState } from 'react';
import { FACTION_PATHWAYS, INITIAL_PUPPETS } from '../../data/gameConfig';

const SectionTitle: React.FC<{ title: string; children?: React.ReactNode; color?: string }> = ({ title, children, color = "text-red-500" }) => (
    <div className="mt-6 mb-3 border-b-2 border-red-500/20 pb-2">
        <h3 className={`text-xl font-cinzel ${color}`}>{title}</h3>
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

const PathwayCard: React.FC<PathwayCardProps> = ({ pathway }) => (
    <div className="bg-black/30 p-4 border border-gray-700/50 flex flex-col h-full">
        <h5 className="font-bold text-lg font-cinzel text-gray-200">{pathway.faction}</h5>
        <div className="bg-red-900/30 p-2 my-2 border-t border-b border-red-500/20">
            <p className="text-sm text-red-300"><span className="font-semibold uppercase tracking-wider">Lộ Trình:</span> {pathway.name}</p>
        </div>
        <p className="text-xs text-gray-400 italic mb-3 flex-grow">{pathway.description}</p>
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
                            term="Bản Chất" 
                            definition="Không phải một con đường có sẵn, mà là hành động tạo ra một Lộ Trình hoàn toàn mới từ sự hỗn loạn của Linh Giới. Nhân Cách của con rối chính là bản thiết kế mà người chơi đang tự viết nên." 
                        />
                         <LoreEntry 
                            term="Rủi Ro" 
                            definition="Mang lại sự tự do tuyệt đối nhưng nguy cơ Mất Kiểm Soát cực kỳ cao và phải tự mình khám phá ra các Nghi Thức Thăng Tiến." 
                        />
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
                    <div className="grid md:grid-cols-2 gap-4">
                        {pathways.map(pathway => <PathwayCard key={pathway.name} pathway={pathway} />)}
                    </div>
                </div>
            );
        case 'core':
        default:
            return (
                <div className="animate-fade-in">
                    <SectionTitle title="Định Luật Cốt Lõi">
                       Các quy tắc bất biến của vũ trụ.
                    </SectionTitle>
                     <div className="space-y-3">
                        <LoreEntry term="'Bức Màn' (The Veil)" definition="Một xã hội bí mật của các Nghệ Nhân Rối, được che giấu bởi một thỏa thuận ngầm. Hành động lộ liễu sẽ thu hút sự chú ý không mong muốn." />
                        <LoreEntry term="Linh Giới & Cổ Thần" definition="Một chiều không gian hỗn loạn, nguồn gốc của sức mạnh huyền bí và là nhà của các Cổ Thần Máy Móc điên loạn." />
                        <LoreEntry term="Phương Pháp Đóng Vai (Nhân Cách)" definition="Cách duy nhất để 'tiêu hóa' sức mạnh một cách an toàn là hành động và suy nghĩ theo đúng bản chất (Nhân Cách) của Lộ Trình." />
                        <LoreEntry term="Cộng Hưởng & Mất Kiểm Soát" definition="Hành động phù hợp tăng Cộng Hưởng. Hành động mâu thuẫn làm hỏng Tâm Cơ Luân, cho phép ảnh hưởng của Cổ Thần tràn vào, dẫn đến Mất Kiểm Soát." />
                        <LoreEntry term="Kim Lệnh vs. Dấu Ấn" definition="Kim Lệnh cho thế giới thông thường. Dấu Ấn Đồng Thau cho thế giới ngầm. Không bao giờ nhầm lẫn." />
                    </div>
                </div>
            )
    }
  }

  return (
    <div className="h-full w-full flex flex-col ui-panel p-4">
        <h3 className="font-cinzel font-bold text-lg text-red-500 mb-3 border-b-2 border-red-500/20 pb-2 text-center">Sổ Tay Tri Thức</h3>
        <div className="border-b border-gray-700 mb-4 flex justify-center gap-1 flex-shrink-0 flex-wrap">
            <LoreTab label="Cốt Lõi" view="core" activeView={activeView} setActiveView={setActiveView} color="text-red-400" />
            <LoreTab label="Độc Lập" view="independent" activeView={activeView} setActiveView={setActiveView} color="text-gray-300" />
            <LoreTab label="Trật Tự" view="order" activeView={activeView} setActiveView={setActiveView} color="text-red-400" />
            <LoreTab label="Trung Lập" view="neutral" activeView={activeView} setActiveView={setActiveView} color="text-gray-300" />
            <LoreTab label="Hỗn Mang" view="chaos" activeView={activeView} setActiveView={setActiveView} color="text-purple-400" />
        </div>
        <div className="overflow-y-auto pr-2 flex-grow">
            {renderContent()}
        </div>
    </div>
  );
};

export default CodexDisplay;