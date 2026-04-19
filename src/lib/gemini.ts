import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  // Strategic Analysis with Maps Grounding
  async analyzeStrategicLocation(address: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the strategic value of this location for a retail kiosk: ${address}. 
      Provide:
      1. Business traffic estimate (Low/Medium/High)
      2. Resident population density (Low/Medium/High)
      3. Nearby strategic points (schools, offices, transport hubs)
      4. A brief qualitative analysis.`,
      tools: [{ googleMaps: {} }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            traffic: { type: Type.STRING },
            density: { type: Type.STRING },
            proximity: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            analysis: { type: Type.STRING }
          },
          required: ["traffic", "density", "proximity", "analysis"]
        }
      }
    } as any);

    return JSON.parse(response.text || "{}");
  },

  // Complex Advisory with High Thinking
  async getComplexAdvisory(query: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: query,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });
    return response.text;
  },

  // Low Latency Search Grounding for General Questions
  async quickSearch(query: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: query,
      tools: [{ googleSearch: {} }]
    } as any);
    return response.text;
  }
};
