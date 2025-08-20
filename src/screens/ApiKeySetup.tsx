import React, { useState } from 'react';

interface ApiKeySetupProps {
  onApiKeySubmit: (key: string) => void;
  initialError: string | null;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySubmit, initialError }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(initialError);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Vui lòng nhập API Key của bạn.');
      return;
    }
    setError(null);
    onApiKeySubmit(apiKey.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fade-in bg-black">
      <div className="w-full max-w-xl mx-auto ui-panel p-8">
        <h2 className="text-4xl font-cinzel text-center text-red-600 mb-2">Yêu Cầu Chìa Khóa</h2>
        <p className="text-center text-gray-400 mb-6">
          Để vận hành các cơ cấu phức tạp của thế giới này, cần có một Chìa Khóa Năng Lượng (Google AI API Key).
        </p>

        {error && <p className="text-red-400 text-center mb-4 bg-red-900/50 p-3 animate-pulse">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-md font-medium text-red-400 mb-2">Nhập Google AI API Key</label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 py-3 px-4 text-white text-lg ui-input"
              placeholder="••••••••••••••••••••••••••••••"
              autoFocus
            />
             <p className="text-xs text-gray-500 mt-2">
              Chìa khóa của bạn chỉ được lưu trong phiên truy cập này và sẽ bị xóa khi bạn đóng tab. Nó không được gửi đến bất kỳ máy chủ nào ngoài Google AI.
              Bạn có thể lấy key tại <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">Google AI Studio</a>.
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-600 text-gray-100 font-bold py-3 px-8 text-lg font-cinzel transition-colors duration-300 shadow-lg hover:shadow-red-500/50 ui-button"
          >
            Kích hoạt Cỗ Máy
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApiKeySetup;
