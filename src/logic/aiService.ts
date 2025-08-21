import { GoogleGenAI, type Type } from "@google/genai";

// Local definition for the response schema type since it's not exported from @google/genai.
type ResponseSchema = {
    type: Type;
    description?: string;
    properties?: Record<string, ResponseSchema>;
    required?: string[];
    items?: ResponseSchema;
    additionalProperties?: ResponseSchema | boolean;
    [key: string]: any;
};

if (!process.env.API_KEY) {
    console.error("Biến môi trường API_KEY chưa được thiết lập. Ứng dụng sẽ không hoạt động chính xác.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const modelConfig = {
    model: "gemini-2.5-flash",
    config: {
        responseMimeType: "application/json",
        temperature: 0.8,
        topP: 0.9,
    },
};

export const generateContentWithSchema = async <T>(prompt: string, schema: ResponseSchema): Promise<T> => {
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
        if (error instanceof Error && 'response' in error) {
            console.error("Phản hồi thô từ AI:", (error as any).response);
        }
        throw new Error("Một tiếng thì thầm từ cõi hư vô vang vọng... Yêu cầu của bạn đã bị thực tại từ chối. Vui lòng thử lại.");
    }
};