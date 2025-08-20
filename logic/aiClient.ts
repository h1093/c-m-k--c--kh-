
import { GoogleGenAI } from "@google/genai";

// As per guidelines, the API key is sourced from process.env.API_KEY.
// It is assumed to be available in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getAI = (): GoogleGenAI => {
    return ai;
};
