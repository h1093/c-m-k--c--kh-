

import React, { useState } from 'react';
import { apiKeyManager } from '../services/ai/aiClient';

interface ApiKeySetupProps {
    onKeyProvided: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onKeyProvided }) => {
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!apiKey.trim()) {
            setError('Vui lòng nhập khóa API của bạn.');
            return;
        }
        apiKeyManager.setApiKey(apiKey.trim());
        onKeyProvided();
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fade-in">
            <div className="w-full max-w-lg mx-auto ui-panel p-8">
                <h2 className="text-4xl font-cinzel text-center text-red-600 mb-2">Thiết Lập Khóa API</h2>
                <p className="text-center text-gray-400 mb-8">Trò chơi này yêu cầu khóa API Google AI để hoạt động.</p>
                
                {error && <p className="text-red-400 text-center mb-6 bg-red-900/50 p-3">{error}</p>}
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="apiKey" className="block text-md font-medium text-red-400 mb-2">Khóa API Google AI của bạn</label>
                        <input
                            type="password"
                            id="apiKey"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 py-3 px-4 text-white text-lg ui-input"
                            placeholder="Dán khóa API của bạn vào đây"
                        />
                    </div>
                    <p className="text-xs text-gray-500">
                        Bạn có thể nhận khóa API miễn phí từ <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">Google AI Studio</a>. Khóa của bạn sẽ chỉ được lưu trong trình duyệt của bạn.
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-red-500/20 flex justify-end">
                    <button onClick={handleSave} className="ui-button py-3 px-8 text-lg">
                        Lưu & Tiếp Tục
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeySetup;