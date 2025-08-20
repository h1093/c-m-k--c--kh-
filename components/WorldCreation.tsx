import React, { useState } from 'react';

interface WorldCreationProps {
  onStart: (customWorldPrompt: string) => void;
}

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
    <div className="flex items-center gap-4 mb-6">
        <div className="bg-red-900/30 p-3 border-2 border-red-500/30">
            {icon}
        </div>
        <div>
            <h3 className="text-2xl font-cinzel text-red-400">{title}</h3>
            <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>
    </div>
);

const WorldCreation: React.FC<WorldCreationProps> = ({ onStart }) => {
    const [worldSetting, setWorldSetting] = useState('');
    const [mainPlot, setMainPlot] = useState('');
    const [characterConcept, setCharacterConcept] = useState('');
    const [error, setError] = useState('');

    const handleStart = () => {
        if (!worldSetting.trim() || !mainPlot.trim() || !characterConcept.trim()) {
            setError('Vui lòng điền đầy đủ tất cả các trường để định hình thế giới của bạn.');
            return;
        }
        setError('');

        const combinedPrompt = `
BỐI CẢNH THẾ GIỚI:
${worldSetting.trim()}

CỐT TRUYỆN CHÍNH:
${mainPlot.trim()}

Ý TƯỞNG NHÂN VẬT CHÍNH:
${characterConcept.trim()}
        `;
        onStart(combinedPrompt);
    };

    return (
        <div className="flex items-center justify-center h-full p-4">
            <div className="w-full max-w-3xl mx-auto ui-panel p-8 animate-fade-in">
                 <SectionTitle 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2H10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.293a1 1 0 010 1.414L7 6.414l.707.707a1 1 0 01-1.414 1.414L5.586 7.828a1 1 0 010-1.414l.707-.707a1 1 0 011.414 0zM11 21h2v-2h-2v2z" /></svg>}
                    title="Chế Tác Vũ Trụ"
                    subtitle="Hãy mô tả thế giới, câu chuyện và anh hùng của riêng bạn."
                />

                {error && <p className="text-red-400 text-center mb-4 bg-red-900/50 p-3 animate-pulse">{error}</p>}

                <div className="space-y-6">
                    <div>
                        <label htmlFor="worldSetting" className="block text-md font-medium text-red-400 mb-2">Bối Cảnh Thế Giới</label>
                        <textarea id="worldSetting" value={worldSetting} onChange={(e) => setWorldSetting(e.target.value)} className="w-full ui-input py-2 px-3" placeholder="Ví dụ: Một vương quốc fantasy nơi phép thuật đang dần tàn lụi, bị thay thế bởi công nghệ hơi nước..." rows={4} />
                    </div>
                     <div>
                        <label htmlFor="mainPlot" className="block text-md font-medium text-red-400 mb-2">Cốt Truyện Chính</label>
                        <textarea id="mainPlot" value={mainPlot} onChange={(e) => setMainPlot(e.target.value)} className="w-full ui-input py-2 px-3" placeholder="Ví dụ: Nhân vật chính phải tìm ra nguyên nhân của sự suy tàn ma thuật, đối đầu với một giáo phái công nghiệp muốn xóa bỏ hoàn toàn phép thuật..." rows={4} />
                    </div>
                     <div>
                        <label htmlFor="characterConcept" className="block text-md font-medium text-red-400 mb-2">Ý Tưởng Nhân Vật</label>
                        <textarea id="characterConcept" value={characterConcept} onChange={(e) => setCharacterConcept(e.target.value)} className="w-full ui-input py-2 px-3" placeholder="Ví dụ: Một pháp sư cuối cùng của dòng dõi hoàng gia, buộc phải học cách thích nghi với công nghệ để sinh tồn và bảo vệ di sản của mình..." rows={4} />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-red-500/20 flex justify-end">
                    <button onClick={handleStart} className="bg-red-700 hover:bg-red-600 text-gray-100 font-bold py-3 px-8 text-lg font-cinzel transition-colors duration-300 shadow-lg hover:shadow-red-500/50">
                        Tiến Vào Tạo Nhân Vật
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorldCreation;