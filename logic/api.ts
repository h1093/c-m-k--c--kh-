
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("Biến môi trường API_KEY chưa được thiết lập");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelConfig = {
    model: "gemini-2.5-flash",
    config: {
        responseMimeType: "application/json",
        temperature: 0.8,
        topP: 0.9,
    },
};

export const generateContentWithSchema = async <T>(prompt: string, schema: any): Promise<T> => {
    try {
        const response = await ai.models.generateContent({
            ...modelConfig,
            contents: prompt,
            config: {
                ...modelConfig.config,
                responseSchema: schema,
            }
        });

        const jsonText = response.text.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonText) as T;
    } catch (error) {
        console.error("Lỗi khi tạo nội dung hoặc phân tích JSON từ AI:", error);
        // Attempt to log the raw response if available
        if (error instanceof Error && 'response' in error) {
            console.error("Phản hồi thô từ AI:", (error as any).response);
        }
        throw new Error("Một tiếng thì thầm từ cõi hư vô vang vọng... Yêu cầu của bạn đã bị thực tại từ chối. Vui lòng thử lại.");
    }
};
