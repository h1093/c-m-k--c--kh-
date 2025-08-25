import React from 'react';
import LoadingSpinner from '../components/UI/LoadingSpinner';

interface AbyssEchoData {
    scene: string;
    choices: string[];
}

interface AbyssEchoScreenProps {
    data: AbyssEchoData | null;
    isLoading: boolean;
    onChoice: (choice: string) => void;
}

const AbyssEchoScreen: React.FC<AbyssEchoScreenProps> = ({ data, isLoading, onChoice }) => {
    if (isLoading || !data) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <LoadingSpinner />
                <p className="mt-4 text-purple-400 font-cinzel animate-pulse">Thực tại đang rạn nứt...</p>
            </div>
        );
    }

    const paragraphs = data.scene.split('\n').filter(p => p.trim() !== '');

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
            <div className="w-full max-w-3xl mx-auto ui-panel p-8 border-2 border-purple-500/30 shadow-2xl shadow-purple-500/10">
                <div className="text-purple-300 leading-relaxed space-y-4 prose prose-invert max-w-none prose-p:text-purple-300 prose-p:leading-8 prose-p:font-serif abyss-glitch-text">
                    {paragraphs.map((p, index) => (
                        <p key={index} style={{ animation: `fade-in ${0.5 + index * 0.2}s ease-out forwards`, opacity: 0 }}>{p}</p>
                    ))}
                </div>
                <div className="mt-12 pt-8 border-t border-purple-500/20">
                    <div className="flex flex-col items-center gap-4">
                        {data.choices.map((choice, index) => (
                            <button
                                key={index}
                                onClick={() => onChoice(choice)}
                                className="w-full max-w-md ui-button py-3 px-6 text-lg bg-purple-900/40 border-purple-700 hover:bg-purple-900/70 hover:border-purple-500 text-purple-200"
                            >
                                {choice}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AbyssEchoScreen;
