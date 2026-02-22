import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const analyzeResume = async (resumeText: string) => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following resume text and provide scores (0-100) for Fit, Authenticity, Clarity, Impact, and Relevance. Also provide a brief summary and key skills identified.
    
    Resume Text:
    ${resumeText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scores: {
            type: Type.OBJECT,
            properties: {
              fit: { type: Type.NUMBER },
              authenticity: { type: Type.NUMBER },
              clarity: { type: Type.NUMBER },
              impact: { type: Type.NUMBER },
              relevance: { type: Type.NUMBER },
            },
            required: ["fit", "authenticity", "clarity", "impact", "relevance"],
          },
          summary: { type: Type.STRING },
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["scores", "summary", "skills"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid response from AI");
  }
};

export const matchJobWithResume = async (resumeText: string, jobDescription: string) => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Compare the following resume against the job description. Provide a match probability (0-100) and a brief explanation of why the candidate is a good fit or what they are missing.
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matchProbability: { type: Type.NUMBER },
          explanation: { type: Type.STRING },
          missingSkills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["matchProbability", "explanation", "missingSkills"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid response from AI");
  }
};
