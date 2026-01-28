import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, EntityType } from "../types";

// Initialize the client
// Note: In a real production app, you should handle API keys more securely than process.env in frontend code if publicly deployed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDocument = async (
  fileName: string,
  base64Data: string,
  mimeType: string
): Promise<AnalysisResult> => {
  
  // Using Gemini 3 Pro for sophisticated extraction
  const modelId = "gemini-3-pro-preview"; 

  const prompt = `
    Analyze the following document: "${fileName}".
    
    Tasks:
    1. Extract key entities: People, Organizations, Locations, Dates, and significant Events.
    2. For Dates, normalize them to YYYY-MM-DD format in the 'normalizedDate' field.
    3. CRITICAL: For every entity, provide a specific 1-sentence context snippet from the text where this entity appears.
    4. Provide a concise 1-sentence summary of the document.

    Return JSON only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            entities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { 
                    type: Type.STRING, 
                    enum: [
                      EntityType.PERSON, 
                      EntityType.ORGANIZATION, 
                      EntityType.LOCATION, 
                      EntityType.DATE, 
                      EntityType.EVENT
                    ] 
                  },
                  context: { type: Type.STRING },
                  normalizedDate: { type: Type.STRING, nullable: true }
                },
                required: ["name", "type", "context"]
              }
            }
          },
          required: ["summary", "entities"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const askAssistant = async (
  query: string,
  contextFiles: Array<{ name: string; summary: string; extractedData: string }>
): Promise<string> => {
  
  // Construct a context string from the analyzed file metadata
  const contextPrompt = contextFiles.map(f => 
    `File: ${f.name}\nSummary: ${f.summary}\nEntities Found: ${f.extractedData}`
  ).join("\n---\n");

  const systemInstruction = `
    You are "DeepSource Assistant", an investigative journalism aid powered by Gemini 3 Pro. 
    You have access to the metadata and extracted entities of the user's uploaded case files.
    Answer questions based strictly on the provided context.
    If the answer is not in the context, state that you don't have that information in the uploaded files.
    Keep answers concise, professional, and objective (Journalistic Tone).
    Date: ${new Date().toISOString()}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Context:\n${contextPrompt}\n\nUser Question: ${query}`,
      config: {
        systemInstruction: systemInstruction
      }
    });

    return response.text || "I could not generate a response.";
  } catch (error) {
    console.error("Chat failed:", error);
    return "Error communicating with the assistant.";
  }
};