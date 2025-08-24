
import { type Type } from "@google/genai";
import { apiKeyManager } from './aiClient';

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

const modelConfig = {
    model: "gemini-2.5-flash",
    config: {
        responseMimeType: "application/json",
        temperature: 0.8,
        topP: 0.9,
    },
};

export const generateContentWithSchema = async <T>(prompt: string, schema: ResponseSchema): Promise<T> => {
    const ai = apiKeyManager.getClient();
    if (!ai) {
        throw new Error("Khóa API chưa được thiết lập. Vui lòng thiết lập khóa API để tiếp tục.");
    }

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

        let errorMessage = "Một tiếng thì thầm từ cõi hư vô vang vọng... Yêu cầu của bạn đã bị thực tại từ chối. Vui lòng thử lại.";

        if (error instanceof Error) {
            const lowerCaseMessage = error.message.toLowerCase();
            if (lowerCaseMessage.includes('[400') || lowerCaseMessage.includes('api key not valid')) {
                errorMessage = "Vé thông hành của ngươi không hợp lệ. Cánh cổng vào Linh Giới từ chối chấp nhận khóa API này.";
            } else if (lowerCaseMessage.includes('[429') || lowerCaseMessage.includes('rate limit')) {
                errorMessage = "Các Cổ Thần Máy Móc đang quá tải. Cơ hội của ngươi đã bị trì hoãn. Hãy thử lại sau giây lát.";
            } else if (lowerCaseMessage.includes('[500') || lowerCaseMessage.includes('[503')) {
                errorMessage = "Linh Giới Cơ Khí đang bất ổn. Một sự cố đã xảy ra từ phía bên kia Bức Màn. Hãy thử lại sau.";
            } else if (lowerCaseMessage.includes("json")) {
                 errorMessage = "Dòng chảy thực tại bị nhiễu loạn. AI đã trả về một phản hồi không thể diễn giải được. Vui lòng thử lại.";
            }
        }
        
        throw new Error(errorMessage);
    }
};