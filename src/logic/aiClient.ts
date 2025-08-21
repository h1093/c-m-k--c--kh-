import { GoogleGenAI } from "@google/genai";

class ApiKeyManager {
    private apiKey: string | null = null;
    private aiClient: GoogleGenAI | null = null;

    constructor() {
        // Ưu tiên: biến môi trường > localStorage
        const envKey = process.env.API_KEY;
        if (envKey) {
            this.apiKey = envKey;
        } else {
            try {
                const storedKey = localStorage.getItem('gemini-api-key');
                if (storedKey) {
                    this.apiKey = storedKey;
                }
            } catch (e) {
                console.error("Không thể truy cập localStorage cho khóa API.", e);
            }
        }
        if (this.apiKey) {
            this.initializeClient();
        }
    }

    private initializeClient() {
        if (this.apiKey) {
            this.aiClient = new GoogleGenAI({ apiKey: this.apiKey });
        } else {
            this.aiClient = null;
        }
    }

    setApiKey(key: string) {
        this.apiKey = key;
        try {
            localStorage.setItem('gemini-api-key', key);
        } catch (e) {
            console.error("Không thể lưu khóa API vào localStorage.", e);
        }
        this.initializeClient();
    }

    getApiKey(): string | null {
        return this.apiKey;
    }

    getClient(): GoogleGenAI | null {
        return this.aiClient;
    }
}

export const apiKeyManager = new ApiKeyManager();
